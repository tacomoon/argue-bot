'use strict'

const { getUpdates, sendMessage } = require('./requests')

module.exports = async (server, key, initial, handler) => {
  const { ts, updates } = await getUpdates(server, key, initial)

  const newMessageUpdates = updates.filter(update => update[0] === 4)

  for (const [, , , peerId, , text] of newMessageUpdates) {
    const answer = (handler(text))
    if (answer) {
      await sendMessage(peerId, answer)
    }
  }

  return ts
}
