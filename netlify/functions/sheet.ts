import { Handler } from '@netlify/functions'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { createAuthUrl, getTokenFromRefresh } from '../../src/google-tokens'
import { camelCase } from 'camel-case'
import qs from 'qs'
import { SHEET_IDS } from '../../src/config'

export const handler: Handler = async event => {
  console.log(event.path.split('/'))

  const sheetCode = event.path.split('/')[2]
  const tabTitle = event.path.split('/')[3]

  const spreadsheetId = SHEET_IDS[sheetCode]?.sheetID

  if (!spreadsheetId) {
    return {
      statusCode: 200,
      body: JSON.stringify(
        Object.entries(SHEET_IDS).map(([key, { name }]) => ({
          name,
          key,
          url: `/sheet/${key}/`
        }))
      )
    }
  }

  // console.log(sheetCode)
  // console.log()

  // const { title } = event.queryStringParameters as { title: string }

  console.log(
    new Date(),
    'calling sheets with queryparams = ',
    event.queryStringParameters
  )

  let token = process.env.ACCESS_TOKEN
  const refreshToken = process.env.REFRESH_TOKEN
  console.log(token, refreshToken)
  // console.log(process.env);

  if (!(token || refreshToken)) {
    return {
      statusCode: 301,
      headers: {
        Location: createAuthUrl(
          'http://localhost:8888',
          'https://www.googleapis.com/auth/spreadsheets.readonly'
        )
      }
      // body: createAuthUrl('http://localhost:8888/api/sheet', 'https://www.googleapis.com/auth/spreadsheets.readonly'),
    }
  }

  if (!token) {
    token = await getTokenFromRefresh(refreshToken)
    // console.log('got token ', token)
  }

  try {
    let values
    if (tabTitle) {
      const range = `${tabTitle}!A1:Z100`
      // console.log('range ', range);

      const response: any = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const keys = response.data.values[0].map(key => camelCase(key))
      console.log(response.data.values)

      values = response.data.values
        .slice(1, response.data.values.length)
        .filter(values => values.length > 0)
        .map(values => {
          return keys.reduce(
            (obj, key, index) => ({
              ...obj,
              [key]: values[index]
            }),
            {}
          )
        })

      // return {
      //   statusCode: 200,
      //   body: JSON.stringify({ values })
      // }
    }

    const response: any = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    const sheets = response.data.sheets.map(sheet => ({
      url: `/sheet/${sheetCode}/${encodeURIComponent(sheet.properties.title)}`
    }))
    return {
      statusCode: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60'
      },
      body: JSON.stringify({
        ...(values && { values }),
        sheets
      })
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      // console.log('axios error', (e as AxiosError).response)
      console.log('axios error', (e as AxiosError).response?.status)
    } else {
      console.log(e)
    }
    return { statusCode: 500 }
  }
}
