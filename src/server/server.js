'use strict'

const { getUpdates, sendMessage } = require('./requests')

module.exports = async (server, key, initial, handler) => {
  const { ts, updates } = await getUpdates(server, key, initial)

  if (updates && updates.length > 0) {
    if (updates[0][0] === 4) {
      const [, , , peerId, , text] = updates[0]
      const answer = (handler(text))
      if (answer) {
        await sendMessage(peerId, answer)
      }
    }
  }

  return ts
}
