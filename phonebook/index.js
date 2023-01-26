require('dotenv').config()

const Number = require('./models/number')
const {req, res, response} = require('express')
const express = require('express')
const cors = require('cors')
const app = express()

// middleware

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

{// Logging, prod

/* let morgan;
if (process.env.NODE_ENV !== 'production') {
    morgan = require('morgan')
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requested'))
    morgan.token('requested', (reqS, resS, param) => {
        return ''
    })
} */}

// RESTful/CRUD

app.get('/info', (req, res) => {
    Number.find({})
        .then(numbers => {
            res.send(`Phonebook has info on ${numbers.length} people. <br>${new Date()}`)
        })
}) 

app.get('/api/persons', (req, res) => {
    Number.find({})
        .then(numbers => {
            res.json(numbers)
        })
})

app.get('/api/persons/:id', (req, res, next) => {
    Number.findById(req.params.id)
        .then(number => {
            if(number) {
                res.json(number)
            }
            else {
                res.status(404).end()
            }
        })
        // CAST ERROR
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    // SAVING

    const newEntry = new Number({
        name: body.name,
        number: body.number,
    })

    Number.find({name : newEntry.name})
        .then(n => {
            if (n.length) {
                res.status(400).send({error: 'Name already in phonebook'})
            } else {
                newEntry.save().then(saved => {
                    res.json(saved)
                })
                .catch(error => next(error))
            }
        })
    
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    
    const updatedEntry = {
        name: body.name,
        number: body.number
    }

    Number.findByIdAndUpdate(req.params.id, updatedEntry, {new: true, runValidators: true, context: 'query'} )
        .then(updated => {
            res.json(updated)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Number.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

// unknown endpoints

const unknownEndpoint = (req, res) => {
    response.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)


// ERROR HANDLER

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    
    if (error.name === 'CastError') {
        return res.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return res.status(400).json(error.message)
    }

    next(error)
}

app.use(errorHandler)


// LISTEN

const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})