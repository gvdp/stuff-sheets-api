
const wretch = require('wretch')

const api = wretch('http://localhost:8888')
  .resolve(r => r.json())

describe('sheet call', () => {
  it('can call sheet api', async () => {
    const res = await api
      .get('/sheet')
      .catch(error => {
        throw new Error(`Call failed with ${error.status}`)
      })
    expect(res).toContainEqual({
         "key": "U6",
         "name": "U6",
         "url": "/sheet/U6/",
       })
  })
})
