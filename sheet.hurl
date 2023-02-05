GET {{baseUrl}}/sheet

HTTP 200
[
  {
    "name": "U6",
    "key": "U6",
    "url": "/sheet/U6/"
  }
]

GET {{baseUrl}}/sheet/U6

HTTP 200
{
  "sheets": [
    {
      "url": "/sheet/U6/Teams"
    },
    {
      "url": "/sheet/U6/Result"
    },
    {
      "url": "/sheet/U6/Group%20Games"
    },
    {
      "url": "/sheet/U6/Knockout%20Games"
    },
    {
      "url": "/sheet/U6/Calculate%20Schedule"
    },
    {
      "url": "/sheet/U6/Calculate%20Knockout"
    },
    {
      "url": "/sheet/U6/Per%20team"
    }
  ]
}

GET {{baseUrl}}/sheet/U6/Result

HTTP 200
{
  "values": [
    {
      "rank": "1"
    },
    {
      "rank": "2"
    },
    {
      "rank": "3"
    },
    {
      "rank": "4"
    },
    {
      "rank": "5"
    },
    {
      "rank": "6"
    },
    {
      "rank": "7"
    },
    {
      "rank": "8"
    },
    {
      "rank": "9"
    },
    {
      "rank": "10"
    }
  ],
  "sheets": [
    {
      "url": "/sheet/U6/Teams"
    },
    {
      "url": "/sheet/U6/Result"
    },
    {
      "url": "/sheet/U6/Group%20Games"
    },
    {
      "url": "/sheet/U6/Knockout%20Games"
    },
    {
      "url": "/sheet/U6/Calculate%20Schedule"
    },
    {
      "url": "/sheet/U6/Calculate%20Knockout"
    },
    {
      "url": "/sheet/U6/Per%20team"
    }
  ]
}