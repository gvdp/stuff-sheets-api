import { Handler } from '@netlify/functions'
import axios, { Axios, AxiosError } from 'axios'
import { createAuthUrl, fetchTokens } from '../../src/google-tokens'

export const handler: Handler = async (event) => {
  const { code } = event.queryStringParameters as { code: string }

  console.log('code = ', code);

  // const token = process.env.TOKEN

  if(!code) {
    return {statusCode: 404}
  }
  // if (!token) {
  //   return {
  //     statusCode: 301,
  //     headers: { 'Location': createAuthUrl('http://localhost:8888', 'https://www.googleapis.com/auth/spreadsheets.readonly') },
  //     // body: createAuthUrl('http://localhost:8888/api/sheet', 'https://www.googleapis.com/auth/spreadsheets.readonly'),
  //   }
  // }

  try {

    // const spreadsheetId = process.env.SHEET_ID
    // const range = 'A1:B3'

    // const response: any = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // })

    const tokens = await fetchTokens(code, 'http://localhost:8888')
    console.log(tokens);




    return {
      statusCode: 200,
      body: `

        ntl env:set REFRESH_TOKEN ${tokens.refresh_token}

        ACCESS_TOKEN=${tokens.access_token}
        REFRESH_TOKEN=${tokens.refresh_token}
        EXPIRES=${String(tokens.expires_in * 1000 + new Date().getTime())}
      `
    }
  } catch (e) {
    if(axios.isAxiosError(e)) {

      console.log((e as AxiosError).response.data)
    } else {
      console.log(e);
      
    }
    return { statusCode: 500 }
  }
}

