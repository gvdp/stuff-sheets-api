import { Handler } from '@netlify/functions'
import axios, { AxiosError } from 'axios'
import { camelCase } from 'camel-case'
import { SHEET_IDS } from '../../src/config'
import { createAuthUrl, getTokenFromRefresh } from '../../src/google-tokens'
import { createClient } from 'redis'

const REDIS_KEY = process.env.REDIS_KEY
const REDIS_HOST = process.env.REDIS_HOST
const client = createClient({
  password: REDIS_KEY,
  socket: {
    host: REDIS_HOST,
    port: 13709,
  },
})

export const handler: Handler = async (event) => {
  const sheetCode = event.path.split('/')[2]
  const tabTitle = event.path.split('/')[3]

  const spreadsheetId = SHEET_IDS[sheetCode]?.sheetID
  const key = `${sheetCode}-${tabTitle}`
  const sheetsKey = `${spreadsheetId}-sheets`

  // todo: type these
  let values
  let sheets

  console.log('get for key', key, sheetsKey)

  if (!spreadsheetId) {
    return {
      statusCode: 200,
      body: JSON.stringify(
        Object.entries(SHEET_IDS).map(([key, { name }]) => ({
          name,
          key,
          url: `/sheet/${key}/`,
        })),
        null,
        2,
      ),
    }
  }

  await client.connect()

  const myKeyValue = await client.get(key)
  const mysheetsKeyValue = await client.get(sheetsKey)

  console.log('myKeyValue', !!myKeyValue)
  if (myKeyValue) {
    values = JSON.parse(myKeyValue)
  }

  console.log('mysheetsKeyValue', !!mysheetsKeyValue)
  if (mysheetsKeyValue) {
    sheets = JSON.parse(mysheetsKeyValue)
  }

  let token = process.env.ACCESS_TOKEN
  const refreshToken = process.env.REFRESH_TOKEN as string

  if (!(token || refreshToken)) {
    return {
      statusCode: 301,
      headers: {
        Location: createAuthUrl('http://localhost:8888', 'https://www.googleapis.com/auth/spreadsheets.readonly'),
        'Cache-Control': '',
      },
    }
  }

  if (!token && refreshToken) {
    token = await getTokenFromRefresh(refreshToken)
  }

  try {
    if (tabTitle && !values) {
      console.log('getting values from google sheet call')
      const range = `${tabTitle}!A1:Z100`
      const response = await axios.get<{ values: string[][] }>(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      const keys = response.data.values[0].map((key) => camelCase(key))

      values = response.data.values
        .slice(1, response.data.values.length)
        .filter((values) => values.length > 0)
        .map((values) => {
          return keys.reduce(
            (obj, key, index) => ({
              ...obj,
              [key]: values[index],
            }),
            {},
          )
        })
      await client.set(key, JSON.stringify(values))
      await client.expire(key, 60) // expire after a minute
    }

    if (!sheets) {
      console.log('listing all sheets from google api')
      const getSheetsResponse = await axios.get<{
        sheets: { properties: { title: string } }[]
      }>(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      sheets = getSheetsResponse.data.sheets.map((sheet) => ({
        url: `/sheet/${sheetCode}/${encodeURIComponent(sheet.properties.title)}`,
      }))

      await client.set(sheetsKey, JSON.stringify(sheets))
      await client.expire(sheetsKey, 24 * 60 * 60) // expire after a day, will never reasonably need to change
    }

    await client.quit()

    return {
      statusCode: 200,
      headers: {
        Location: '',
        'Cache-Control': 'public, s-maxage=60',
      },
      body: JSON.stringify(
        {
          ...(values && { values }),
          sheets,
        },
        null,
        2,
      ),
    }
  } catch (e) {
    await client.quit()

    if (axios.isAxiosError(e)) {
      console.error('axios error', (e as AxiosError).response?.status)
    } else {
      console.error(e)
    }
    return { statusCode: 500 }
  }
}
