const topicsRouter = require('express').Router()
const Topic = require('../models/topic')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

topicsRouter.get('/', async (request, response) => {
  const topics = await Topic
    .find({}).populate('user', { username: 1})
    .populate('answers', { content: 1 })

  response.json(topics)
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

topicsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const topic = new Topic({
    title: body.title,
    user: user.id
  })
  

  const savedTopic = await topic.save()

  user.topics = user.topics.concat(savedTopic._id)
  await user.save()

  response.status(201).json(savedTopic)
})

topicsRouter.get('/:id', async (request, response, next) => {
  const topic = await Topic.findById(request.params.id)
  .populate('user', { username: 1})
  .populate('answers', { content: 1 })
  if (topic) {
    response.json(topic)
  } else {
    response.status(404).end()
  }
})

topicsRouter.delete('/:id', async (request, response, next) => {
  await Topic.findByIdAndRemove(request.params.id)
  response.status(200).end()
})

module.exports = topicsRouter