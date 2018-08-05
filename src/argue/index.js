'use strict'

const config = require('config')
const { logger: log } = require('../utils')

const answerMap = config.get('answerMap')

function chooseAnswer (message) {
  const escapedMessage = message.trim().toLowerCase()

  for (const [key, value] of Object.entries(answerMap)) {
    if (value.includes(escapedMessage)) {
      log.info(`Choose answer '${key}' for message '${escapedMessage}'`)
      return key
    }
  }
  log.info(`Choose no answer for message '${escapedMessage}'`)
}

module.exports = {
  chooseAnswer
}
