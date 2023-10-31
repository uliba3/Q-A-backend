const answersRouter = require('express').Router()
const Answer = require('../models/answer')
const User = require('../models/user')
const Topic = require('../models/topic')
const jwt = require('jsonwebtoken')

answersRouter.get('/', async (request, response) => {
  const answers = await Answer
    .find({}).populate('user', { username: 1})
    .populate('topic', { title: 1 })

  response.json(answers)
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

answersRouter.post('/', async (request, response, next) => {
  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  console.log(body)
  const topic = await Topic.findById(body.topic)

  const answer = new Answer({
    ...body,
    user: user.id
  })

  const savedAnswer = await answer.save()

  user.answers = user.answers.concat(savedAnswer._id)
  await user.save()

  topic.answers = topic.answers.concat(savedAnswer._id)
  await topic.save()

  response.status(201).json(savedAnswer)
})

answersRouter.get('/rand', async (request, response) => {
  try {
    const count = await Answer.countDocuments(); // Get the total number of answers in the database
    const randomIndex = Math.floor(Math.random() * count); // Generate a random index within the range of available answers
    const randomAnswer = await Answer.findOne().skip(randomIndex); // Find a random answer using the generated index
    response.json(randomAnswer); // Send the random topic as a JSON response
  } catch (error) {
    response.status(500).json({ error: 'An error occurred while fetching a random topic.' });
  }
})

answersRouter.get('/randTopic/:id', async (request, response, next) => {
  const topicId = request.params.id
  try {
    const count = await Answer.find({ topic: topicId }).countDocuments(); // Get the total number of topics in the database
    const randomIndex = Math.floor(Math.random() * count); // Generate a random index within the range of available topics
    const randomAnswer = await Answer.findOne({ topic: topicId }).skip(randomIndex); // Find a random topic using the generated index
    response.json(randomAnswer); // Send the random topic as a JSON response
  } catch (error) {
    response.status(500).json({ error: 'An error occurred while fetching a random topic.' });
  }
})

answersRouter.get('/:id', async (request, response, next) => {
  const answer = await Answer.findById(request.params.id)
  if (answer) {
    response.json(answer)
  } else {
    response.status(404).end()
  }
})

answersRouter.delete('/:id', async (request, response, next) => {
  await Answer.findByIdAndRemove(request.params.id)
    .populate('user', { username: 1})
    .populate('topic', { title: 1 })
  response.status(200).end()
})

answersRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const answer = {
    ...body
  }

  const updatedAnswer = await Answer.findByIdAndUpdate(request.params.id, answer, { new: true })
  response.status(200).json(updatedAnswer);
})

module.exports = answersRouter