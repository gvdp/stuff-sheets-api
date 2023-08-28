## Running

- run `yarn start` , functions served at `localhost:8888`

- env vars set in netlify `ntl env:list`

- get sheet info e.g. `http://localhost:8888/sheet/TEST/Group%20Games`

- REFRESH_TOKEN might be bad, `ntl env:unset REFRESH_TOKEN`

- calling api redirects to google auth url => allow access (vdputteglenn@gmail.com)
  => redirects to index function with callback code
  => set refresh toke as in response body `ntl env:set REFRESH_TOKEN *****`
  => restart functions

## API

`http://localhost:8888/sheet` => list of possible other uris with correct sheets

## Deploy your own

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/gvdp/sheets-as-an-api)
