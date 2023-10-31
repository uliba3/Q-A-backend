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

topicsRouter.get('/rand', async (request, response) => {
  try {
    const count = await Topic.countDocuments(); // Get the total number of topics in the database
    const randomIndex = Math.floor(Math.random() * count); // Generate a random index within the range of available topics
    const randomTopic = await Topic.findOne().skip(randomIndex); // Find a random topic using the generated index
    response.json(randomTopic); // Send the random topic as a JSON response
  } catch (error) {
    response.status(500).json({ error: 'An error occurred while fetching a random topic.' });
  }
});


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