'use strict'

const config = {
  express: {
    port: 3000
  },
  answerMap: {
    'Да': ['нет', 'не', 'не-а'],
    'Нет': ['да', 'ага'],
    'Нет, ты': ['нет, ты', 'нет ты'],
    'Нет, я': ['нет, я', 'нет я']
  }
}

module.exports = config
