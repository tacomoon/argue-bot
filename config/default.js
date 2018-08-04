'use strict'

const config = {
  express: {
    port: 3000
  },
  vk: {
    require: true,
    apiVersion: 5.8,
    wait: 25,
    accessToken: process.env.VK_TOKEN
  },
  answerMap: {
    'Да': ['нет', 'не', 'не-а'],
    'Нет': ['да', 'ага'],
    'Нет, ты': ['нет, ты', 'нет ты'],
    'Нет, я': ['нет, я', 'нет я']
  }
}

module.exports = config
