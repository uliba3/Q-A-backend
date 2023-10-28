const testingRouter = require('express').Router()
const Answer = require('../models/answer')
const User = require('../models/user')
const Topic = require('../models/topic')

testingRouter.post('/reset', async (request, response) => {
  await Answer.deleteMany({})
  await User.deleteMany({})
  await Topic.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter