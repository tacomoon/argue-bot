'use strict'

const express = require('express')

const {chooseAnswer} = require('./argue')

const port = 3000

const app = express()

app.get('/', (request, response) => {
  response.send('ok')
})

app.get('/test/:message', (request, response) => {
  const answer = chooseAnswer(request.params.message)
  response.send(answer ? answer : "No answer provided")
})

app.listen(port, () => {
  console.log(`Server started: http://localhost:${port}/`)
})

