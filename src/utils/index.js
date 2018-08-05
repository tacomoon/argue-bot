'use strict'

function formattedDate (date = new Date()) {
  return date.toISOString()
    .replace(/T/, ' ')
    .slice(0, -1)
}

class Logger {
  info (message) {
    console.log(`${formattedDate()}  INFO: ${message}`)
  }

  error (message) {
    console.log('\x1b[31m', `${formattedDate()} ERROR: ${message}`)
  }
}

const logger = new Logger()

module.exports = { logger }
