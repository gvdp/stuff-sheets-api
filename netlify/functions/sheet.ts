import { Handler } from '@netlify/functions'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { createAuthUrl } from '../../src/google-tokens'
import { camelCase } from "camel-case";
import qs from 'qs'

export const handler: Handler = async (event) => {
  const { title } = event.queryStringParameters as { title: string }

  console.log(new Date(), 'calling sheets with queryparams = ', event.queryStringParameters);

  let token = process.env.ACCESS_TOKEN
  const refreshToken = process.env.REFRESH_TOKEN
// console.log(token, refreshToken);
// console.log(process.env);

  if (!(token || refreshToken)) {
    return {
      statusCode: 301,
      headers: { 'Location': createAuthUrl('http://localhost:8888', 'https://www.googleapis.com/auth/spreadsheets.readonly') },
      // body: createAuthUrl('http://localhost:8888/api/sheet', 'https://www.googleapis.com/auth/spreadsheets.readonly'),
    }
  }

if(!token) {

token = await  getTokenFromRefresh(refreshToken)

}


  const spreadsheetId = process.env.SHEET_ID


  try {

    let values
    if (title) {
      const range = `${title}!A1:Z100`
      // console.log('range ', range);

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
       headers: {
      'Cache-Control': 'public, s-maxage=60',
    },
      body: JSON.stringify({
        ...values && { values },
        sheets
      })
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {

      // console.log('axios error', (e as AxiosError).response)
      console.log('axios error', (e as AxiosError).response?.status)
    } else {
      console.log(e);

    }
    return { statusCode: 500 }
  }
}



export async function getTokenFromRefresh(refreshToken: string): Promise<string> {
  console.log('refreshing token')
  const params = qs.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: 'refresh_token'
  })
  const options: AxiosRequestConfig = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: params,
    url: 'https://oauth2.googleapis.com/token'
  }

  try {
    const resp = await axios.request(options)
    // console.log('got access token', resp.data)
    return resp.data.access_token
  } catch (e) {
    console.log('err in fetching token')
    console.error(e)
    throw new Error('Token refresh failed ')
  }
}