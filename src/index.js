'use strict'

const config = require('config')
const express = require('express')

const { chooseAnswer } = require('./argue')
const server = require('./server')

const { port } = config.get('express')

const app = express()

app.get('/', (request, response) => {
  response.send('ok')
})

app.get('/test/:message', (request, response) => {
  const answer = chooseAnswer(request.params.message)
  response.send(answer || 'No answer provided')
})

app.listen(port, () => {
  console.log(`Server started: http://localhost:${port}/`)

  console.log('Starting server')
  server(chooseAnswer)
})
