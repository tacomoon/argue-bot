'use strict'

const config = require('config')
const express = require('express')

const vk = require('./vk')
const { chooseAnswer } = require('./argue')

const { port } = config.get('express')
const { require: vkRequired } = config.get('vk')

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

  if (vkRequired) {
    console.log('Starting VK server')
    vk.server(chooseAnswer)
  }
})
