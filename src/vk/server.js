'use strict'

const axios = require('axios')
const config = require('config')

const { accessToken, apiVersion, wait } = config.get('vk')

function requestUpdates (server, key, ts) {
  return executeRequest(`https://${server}?act=a_check&key=${key}&ts=${ts}&wait=${wait}&mode=2&version=3`)
}

function requestApiMethod (method, params) {
  return executeRequest(`https://api.vk.com/method/${method}`, {
    ...params,
    access_token: accessToken,
    v: apiVersion
  })
}

function executeRequest (url, params) {
  return axios.get(url, { params })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.log(error)
    })
}

module.exports = async handler => {
  const { response: { key, server, ts } } = await requestApiMethod('messages.getLongPollServer')

  let lastTs = ts
  while (true) {
    const { ts, updates } = await requestUpdates(server, key, lastTs)

    const filter = updates.filter(update => {
      const [event] = update
      return event === 4
    })

    console.log(`current ts: ${ts}`)
    console.log(`new messages: ${filter}`)

    // TODO message
    console.log(`handler: ${handler('да')}`)

    lastTs = ts
  }
}
