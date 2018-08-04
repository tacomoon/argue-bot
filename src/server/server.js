'use strict'

const { getUpdates, sendMessage } = require('./requests')

module.exports = async (server, key, initial, handler) => {
  const { ts, updates } = await getUpdates(server, key, initial)

  const newMessages = updates.filter(update => {
    const [event] = update
    return event === 4
  })

  for (const [, , , peerId, , text] of newMessages) {
    const answer = (handler(text))
    if (answer) {
      await sendMessage(peerId, answer)
    }
  }

  return ts
}
