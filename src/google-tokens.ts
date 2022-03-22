import qs from 'qs'
import axios, { AxiosRequestConfig } from 'axios'

export function createAuthUrl(redirect_uri: string, scope: string): string {
  let authUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
  authUrl += `?client_id=${process.env.GOOGLE_CLIENT_ID}`
  authUrl += `&redirect_uri=${redirect_uri}`
  authUrl += `&response_type=code`
  authUrl += `&prompt=consent`
  authUrl += `&access_type=offline`
  authUrl += `&scope=${scope}\t`
  return authUrl
}

export async function fetchTokens(code: string, redirect_uri: string): Promise<{ expires_in: number; refresh_token: string; access_token: string } | undefined> {
  console.log('getting token using code')
  const params = qs.stringify({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri,
    grant_type: 'authorization_code'
  })
  const options: AxiosRequestConfig = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: params,
    url: 'https://oauth2.googleapis.com/token'
  }

  try {
    const resp = await axios.request(options)
    console.log('got access token', resp.data)
    return {
      access_token: resp.data.access_token,
      refresh_token: resp.data.refresh_token,
      expires_in: resp.data.expires_in
    }
  } catch (e) {
    console.log('error in fetching token', e)
  }
}

export async function refreshToken(refreshToken: string) {
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
    console.log('got access token', resp.data)
    return resp.data
  } catch (e) {
    console.log('err in fetching token')
    console.error(e)
    throw new Error('Token refresh failed ')
  }
}
