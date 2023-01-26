require('dotenv').config()

const { response } = require('express')
const express = require('express')
const cors = require('cors')
const NumEntry = require('./models/number')

const app = express()

// middleware

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

// RESTful/CRUD

app.get('/info', (_req, res) => {
  NumEntry.find({})
    .then((numbers) => {
      res.send(`Phonebook has info on ${numbers.length} people. <br>${new Date()}`)
    })
})

app.get('/api/persons', (_req, res) => {
  NumEntry.find({})
    .then((numbers) => {
      res.json(numbers)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
  NumEntry.findById(req.params.id)
    .then((number) => {
      if (number) {
        res.json(number)
      } else {
        res.status(404).end()
      }
    })
    // CAST ERROR
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  // SAVING

  const newEntry = new NumEntry({ name, number })

  NumEntry
    .find({ name: newEntry.name })
    .then((n) => {
      if (n.length) {
        res.status(400).send({ error: 'Name already in phonebook' })
      } else {
        newEntry
          .save()
          .then((saved) => {
            res.json(saved)
          })
          .catch((error) => next(error))
      }
    })
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  NumEntry.findByIdAndUpdate(req.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then((updated) => {
      res.json(updated)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  NumEntry.findByIdAndRemove(req.params.id)
    // eslint-disable-next-line no-unused-vars
    .then((_result) => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

// unknown endpoints

// eslint-disable-next-line no-unused-vars
const unknownEndpoint = (_req, _res) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// ERROR HANDLER

// eslint-disable-next-line consistent-return
const errorHandler = (error, _req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json(error.message)
  }

  next(error)
}

app.use(errorHandler)

// LISTEN

const { PORT } = process.env
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
