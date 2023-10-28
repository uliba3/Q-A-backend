const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  answers: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer'
    }
  ]
})

topicSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Topic', topicSchema)