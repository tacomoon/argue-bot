'use strict'

const axios = require('axios')
const config = require('config')

const { token, version, wait } = config.get('server')

function requestUpdates (server, key, ts) {
  return executeRequest(`https://${server}?act=a_check&key=${key}&ts=${ts}&wait=${wait}&mode=2&version=3`)
}

function sendMessage (peerId, message) {
  // executeRequest(`https://api.vk.com/method/messages.send?peer_id=${peerId}&message=${message}&access_token=${token}&v=${version}`)
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
      return response.data
    })
    .catch((error) => {
      console.log(error)
    })
}

module.exports = async function server (handler) {
  const { response: { key, server, ts } } = await requestApiMethod('messages.getLongPollServer')

  let lastTs = ts
  while (true) {
    await requestUpdates(server, key, lastTs)
      .then(({ ts, updates }) => {
        lastTs = ts

        const newMessages = updates.filter(update => {
          const [event] = update
          return event === 4
        })

        for (const [, , , peerId, , text] of newMessages) {
          const answer = (handler(text))
          if (answer) {
            sendMessage(peerId, answer)
          }
        }
      })
  }
}
