'use strict'

const config = require('config')
const express = require('express')

const { loopServer, getLongPullServer } = require('./server')
const { chooseAnswer } = require('./argue')
const { port } = config.get('express')

const app = express()

app.get('/', (request, response) => {
  response.send('ok')
})

app.get('/test/:message', (request, response) => {
  const answer = chooseAnswer(request.params.message)
  response.send(answer || 'No answer provided')
})

app.listen(port, async () => {
  console.log(`Server started: http://localhost:${port}/`)

  console.log('Starting server')

  const { response: { server, key, ts: initial } } = await getLongPullServer()

  let ts = initial
  while (true) {
    ts = await loopServer(server, key, ts, chooseAnswer)
  }
})
