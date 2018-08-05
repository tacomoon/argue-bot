'use strict'

const axios = require('axios')
const config = require('config')
const { token, version, wait } = config.get('server')
const { logger: log } = require('../utils')

function getLongPullServer () {
  return requestApiMethod('messages.getLongPollServer')
}

function getUpdates (server, key, ts) {
  return executeRequest(`https://${server}?act=a_check`, { key, ts, wait, mode: 2, version: 3 })
}

function sendMessage (peerId, message) {
  requestApiMethod(`messages.send`, { peer_id: peerId, message })
}

function requestApiMethod (method, params) {
  return executeRequest(`https://api.vk.com/method/${method}`, {
    ...params,
    access_token: token,
    v: version
  })
}

function executeRequest (url, params) {
  return axios.get(url, { params })
    .then((response) => {
      log.info(`${getUrl(response)}\nResponse: ${JSON.stringify(response.data)}`)
      return response.data
    })
    .catch((error) => {
      log.error(`${getUrl(error)}\n ${error}`)
    })
}

function getUrl (response) {
  const base = response.config.url
  const params = Object.entries(response.config.params)
    .reduce((result, [key, value]) => {
      return `${result}${key}=${value}&`
    }, '?')

  return base + params
}

module.exports = {
  getLongPullServer,
  getUpdates,
  sendMessage
}
