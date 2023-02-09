import  wretch from 'wretch'

const api = wretch('http://localhost:8888').resolve(r => r.json())

describe('sheet call', () => {
  it('can call sheet api', async () => {
    const res = await api.get('/sheet').catch(error => {
      throw new Error(`Call failed with ${error.status}`)
    })
    expect(res).toContainEqual({
      key: 'U6',
      name: 'U6',
      url: '/sheet/U6/'
    })
  })
  it('can list all the tabs in the sheet', async () => {
    const res = await api.get('/sheet/U6').catch(error => {
      throw new Error(`Call failed with ${error.status}`)
    })
    expect(res).toEqual({
      sheets: [
        {
          url: '/sheet/U6/Teams'
        },
        {
          url: '/sheet/U6/Result'
        },
        {
          url: '/sheet/U6/Group%20Games'
        },
        {
          url: '/sheet/U6/Knockout%20Games'
        },
        {
          url: '/sheet/U6/Calculate%20Schedule'
        },
        {
          url: '/sheet/U6/Calculate%20Knockout'
        },
        {
          url: '/sheet/U6/Per%20team'
        }
      ]
    })
  })
  it('can list all values in a tab', async () => {
    const res = await api.get('/sheet/U6/Result').catch(error => {
      throw new Error(`Call failed with ${error.status}`)
    })
    expect(res).toEqual({
      values: [
        {
          rank: '1'
        },
        {
          rank: '2'
        },
        {
          rank: '3'
        },
        {
          rank: '4'
        },
        {
          rank: '5'
        },
        {
          rank: '6'
        },
        {
          rank: '7'
        },
        {
          rank: '8'
        },
        {
          rank: '9'
        },
        {
          rank: '10'
        }
      ],
      sheets: [
        {
          url: '/sheet/U6/Teams'
        },
        {
          url: '/sheet/U6/Result'
        },
        {
          url: '/sheet/U6/Group%20Games'
        },
        {
          url: '/sheet/U6/Knockout%20Games'
        },
        {
          url: '/sheet/U6/Calculate%20Schedule'
        },
        {
          url: '/sheet/U6/Calculate%20Knockout'
        },
        {
          url: '/sheet/U6/Per%20team'
        }
      ]
    })
  })
})
