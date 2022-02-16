import { Handler } from '@netlify/functions'
import axios, { AxiosError } from 'axios'
import { createAuthUrl } from '../../src/google-tokens'
import { camelCase } from "camel-case";

export const handler: Handler = async (event) => {
  const { title } = event.queryStringParameters as { title: string }

  console.log('queryparams = ', event.queryStringParameters);

  const token = process.env.ACCESS_TOKEN

  if (!token) {
    return {
      statusCode: 301,
      headers: { 'Location': createAuthUrl('http://localhost:8888', 'https://www.googleapis.com/auth/spreadsheets.readonly') },
      // body: createAuthUrl('http://localhost:8888/api/sheet', 'https://www.googleapis.com/auth/spreadsheets.readonly'),
    }
  }
  const spreadsheetId = process.env.SHEET_ID


  try {

    let values
    if (title) {
      const range = `${title}!A1:Z100`
      console.log('range ', range);

      const response: any = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const keys = response.data.values[0].map(key => camelCase(key))
      values = response.data.values.slice(1, response.data.values.length - 1)
        .map((values) => {
          return keys.reduce((obj, key, index) => ({
            ...obj,
            [key]: values[index]
          }), {})
        })

      // return {
      //   statusCode: 200,
      //   body: JSON.stringify({ values })
      // }

    }


    const response: any = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })




    const sheets = response.data.sheets.map(sheet => ({ url: `/sheet?title=${sheet.properties.title}` }));
    return {
      statusCode: 200,
      body: JSON.stringify({
        ...values && { values },
        sheets
      })
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {

      console.log((e as AxiosError).response)
    } else {
      console.log(e);

    }
    return { statusCode: 500 }
  }
}

