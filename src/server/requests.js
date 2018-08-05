'use strict'

const axios = require('axios')
const config = require('config')
const { token, version, wait } = config.get('server')
const { logger: log } = require('../utils')

async function getLongPullServer () {
  return requestApiMethod('messages.getLongPollServer')
}

async function getUpdates (server, key, ts) {
  return executeRequest(`https://${server}?act=a_check`, { key, ts, wait, mode: 2, version: 3 })
}

async function sendMessage (peerId, message) {
  await requestApiMethod(`messages.send`, { peer_id: peerId, message })
}

async function requestApiMethod (method, params) {
  return executeRequest(`https://api.vk.com/method/${method}`, {
    ...params,
    access_token: token,
    v: version
  })
}

async function executeRequest (url, params) {
  return axios.get(url, { params })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      log.error(error)
    })
}

module.exports = {
  getLongPullServer,
  getUpdates,
  sendMessage
}
