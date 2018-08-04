'use strict'

const config = require('config')

const answerMap = config.get('answerMap')

function chooseAnswer (message) {
  const escapedMessage = message.trim().toLowerCase()

  for (const [key, value] of Object.entries(answerMap)) {
    if (value.includes(escapedMessage)) {
      return key
    }
  }
}

module.exports = {
  chooseAnswer
}
