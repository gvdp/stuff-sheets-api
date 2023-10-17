import { Handler } from '@netlify/functions'
import axios, { AxiosError } from 'axios'
import { camelCase } from 'camel-case'
import { SHEET_IDS } from '../../src/config'
import { getTokenFromRefresh } from '../../src/google-tokens'

export const handler: Handler = async event => {
  const sheetCode = event.path.split('/')[2]
  const tabTitle = event.path.split('/')[3]

  const spreadsheetId = SHEET_IDS[sheetCode]?.sheetID

  let token = process.env.ACCESS_TOKEN
  const refreshToken = process.env.REFRESH_TOKEN as string

  if (!token && refreshToken) {
    token = await getTokenFromRefresh(refreshToken)
  }

  try {
    const range = `${tabTitle}!A1:Z100`
    const response = await axios.get<{ values: string[][] }>(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )


    const headerRow = response.data.values[0]
    const keys = headerRow.map((key, index) => ({
      index,
      column: `ABCDEFGHJKLMNOPQRSTUVWXYZ`[index],
      key: camelCase(key),
    }))

    console.log('keys', keys);

    const allValues: Record<string, string | number>[] = response.data.values.splice(1).map((row, rowIndex) => {
      const keyValueArray = row.map((value, rowIndex) => ({
        value,
        key: keys.find(({ index }) => index === rowIndex)?.key,
      }))
      return keyValueArray.reduce((obj, rowPart) => ({ ...obj, [`${rowPart.key}`]: rowPart.value }), {rowIndex: rowIndex+2 })
    })

    
    const objectToUpdate = allValues.find(({id}) => id === `${JSON.parse(event.body || "").id}`)
    
    console.log('objectToUpdate', objectToUpdate);
    // todo: dynamically set end column (F) based on number of keys
    const updateRange = `'${decodeURIComponent(tabTitle)}'!A${objectToUpdate?.rowIndex}:Z${objectToUpdate?.rowIndex}`
    const newObject = {...objectToUpdate, ...JSON.parse(event.body || '')}
    const objectToValueArray = keys.map(({key}) => newObject[key] || '')

    const putBody = {
      range: updateRange,
      values: [objectToValueArray],
      majorDimension: 'ROWS',
    }
    console.log('updating values in sheet', putBody)
    const putResp = await axios.put(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(updateRange)}`,
      putBody,
      {
        params: { valueInputOption: 'RAW' },
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    console.log('putRespo', putResp);

    if(putResp.status === 200) {
      return {statusCode: 200, body: JSON.stringify(putResp.data)}
    } else {
      return { statusCode: 500 }
    }

  } catch (e) {

    if (axios.isAxiosError(e)) {
      // console.log('e', e);
      console.error('axios error', (e as AxiosError).response?.status, (e as AxiosError).response?.data.error)
    } else {
      console.error(e)
    }
    return { statusCode: 500 }
  }
}
