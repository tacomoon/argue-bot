'use strict'

const fs = require('fs')
const config = require('config')

const { logToFile } = config.get('logger')

function formatMessage (level, message) {
  const date = new Date().toISOString()
    .replace(/T/, ' ')
    .slice(0, -1)

  return `${date} ${level}: ${message}`
}

function writeToConsole (message) {
  console.log(message)
}

function writeToFile (message) {
  if (logToFile) {
    fs.appendFileSync('server.log', message + '\n')
  }
}

class Logger {
  info (message) {
    const formattedMessage = formatMessage(' INFO', message)

    writeToFile(formattedMessage)
    writeToConsole(formattedMessage)
  }

  error (message) {
    const formattedMessage = formatMessage('ERROR', message)

    writeToFile(formattedMessage)
    writeToConsole(formattedMessage)
  }
}

const logger = new Logger()

module.exports = { logger }
