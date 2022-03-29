// import axios, { AxiosResponse } from 'axios'

// export const setTokens = (res: AxiosResponse<any>, prefix: string) => {
//   if (res.data.access_token) {
//     localStorage.setItem(`${prefix}_access_token`, res.data.access_token)
//   }
//   if (res.data.refresh_token) {
//     localStorage.setItem(`${prefix}_refresh_token`, res.data.refresh_token)
//   }
//   if (res.data.expires_in) {
//     console.log('set expire time', String(res.data.expires_in * 1000 + new Date().getTime()))
//     localStorage.setItem(
//       `${prefix}_expires`,
//       String(res.data.expires_in * 1000 + new Date().getTime())
//     )
//   }
// }

// const clearTokens = (prefix: string) => {
//   // todo: also disable plugin when doing this
//   localStorage.removeItem(`${prefix}_access_token`)
//   localStorage.removeItem(`${prefix}_refresh_token`)
//   localStorage.removeItem(`${prefix}_expires`)
// }

// export function getAuthToken(prefix: string) {
//   return localStorage.getItem(`${prefix}_access_token`)
// }

// // function getRefreshToken(prefix: string) {
// //   return localStorage.getItem(`${prefix}_refresh_token`)
// // }

// // function getExpirationTime(prefix: string) {
// //   return localStorage.getItem(`${prefix}_expires`)
// // }

// export function logout(prefix: string) {
//   return async () => {
//     localStorage.removeItem(`${prefix}_access_token`)
//   }
// }

// // export const isLoggedIn = (prefix: string) => {
// //   return async () => {
// //     const code = new URLSearchParams(window.location.search).get('code')
// //     const scope = new URLSearchParams(window.location.search).get('scope')
// //     // console.log('scope ', scope)
// //     if (code && scope && scope.includes(prefix)) {
// //       console.log('getting token for ', prefix, ' with ', code)
// //       const res = await axios.get('/api/google-get-token', {
// //         params: { code, returnUrl: window.location.origin }
// //       })
// //       console.log('got tokens', res.data)
// //       setTokens(res, prefix)
// //       window.location.replace(window.location.origin)
// //     }
// //     console.log(
// //       'is there a token for ',
// //       prefix,
// //       getAuthToken(prefix),
// //       getAuthToken(prefix) !== null
// //     )
// //     return getAuthToken(prefix) !== null
// //   }
// // }

// // function tokenIsExpired(prefix: string): boolean {
// //   return Number(getExpirationTime(prefix)) < new Date().getTime()
// // }

// // export const refreshIfExpired = async (prefix: string) => {
// //   if (tokenIsExpired(prefix)) {
// //     console.log(
// //       'token will expire at ',
// //       getExpirationTime(prefix),
// //       `it's now `,
// //       new Date().getTime()
// //     )
// //     console.log('refreshing token for ', prefix, ' using ', getRefreshToken(prefix))
// //     try {
// //       const res = await axios.get('/api/google-refresh-token', {
// //         params: { refresh_token: getRefreshToken(prefix) }
// //       })
// //       console.log('got refresh token ', res.data)
// //       setTokens(res, prefix)
// //     } catch (e) {
// //       console.error('refreshing token failed', e)
// //       clearTokens(prefix)
// //     }
// //   }
// // }

// // export const login = (prefix: string) => {
// //   return async () => {
// //     const url = (
// //       await axios.get(`/api/${prefix}-get-auth-url`, {
// //         params: { returnUrl: window.location.origin }
// //       })
// //     ).data
// //     console.log('got url', url)
// //     window.location.href = url
// //   }
// // }
