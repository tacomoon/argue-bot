'use strict'

const config = require('config')
const express = require('express')
const { logger: log } = require('./utils')

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
  log.info(`Server started: http://localhost:${port}/`)

  log.info('Starting server')

  const { response: { server, key, ts: initial } } = await getLongPullServer()

  let ts = initial
  while (true) {
    ts = await loopServer(server, key, ts, chooseAnswer)
  }
})
