'use strict'

const fs = require('fs')

function formatMessage (level, message) {
  const date = new Date().toISOString()
    .replace(/T/, ' ')
    .slice(0, -1)

  return `${date} ${level}: ${message}`
}

class Logger {
  info (message) {
    const formattedMessage = formatMessage(' INFO', message)

    console.log(formattedMessage)
    fs.appendFileSync('server.log', formattedMessage + '\n')
  }

  error (message) {
    const formattedMessage = formatMessage('ERROR', message)

    console.log('\x1b[31m', formattedMessage)
    fs.appendFileSync('server.log', formattedMessage + '\n')
  }
}

const logger = new Logger()

module.exports = { logger }
