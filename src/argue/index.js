"use strict";

const answerMap = new Map([
  ['Да', ['нет', 'не', 'не-а']],
  ['Нет', ['да', 'ага']],
  ['Нет, ты', ['нет, ты', 'нет ты']],
  ['Нет, я', ['нет, я', 'нет я']]
])

function chooseAnswer(message) {
  const escapedMessage = message.trim().toLowerCase()

  for (let [key, value] of answerMap) {
    if (value.includes(escapedMessage)) {
      return key
    }
  }
}

module.exports = {
  chooseAnswer
}