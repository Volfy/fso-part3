require('dotenv').config()

const Number = require('./models/number')
const {req, res} = require('express')
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

// Logging, prod

let morgan;
if (process.env.NODE_ENV !== 'production') {
    morgan = require('morgan')
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requested'))
    morgan.token('requested', (reqS, resS, param) => {
        return ''
    })
}

// RESTful/CRUD

app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1><br>' +
                '<em>/info</em> for general info<br>' +
                '<em>/api/persons</em> for all persons<br>' +
                '<em>/api/persons/(id)</em> for specific entry<br>')
})

app.get('/info', (req, res) => {
    // console.log(req.headers)
    Number.find({})
        .then(numbers => {
            res.send(`Phonebook has info on ${numbers.length} people. <br>${new Date()}`)
        })
}) 

app.get('/api/persons', (req, res) => {
    // console.log(req.headers)
    Number.find({})
        .then(numbers => {
            res.json(numbers)
        })
})

app.get('/api/persons/:id', (req, res) => {
    Number.findById(req.params.id).then(number => {
        res.json(number)
    })
})

// to do: port to mongoose

app.post('/api/persons', (req, res) => {
    // console.log(req.headers)
    const body = req.body
    if (process.env.NODE_ENV !== 'production') {
        morgan.token('requested', (req, res, param) => {
            return JSON.stringify(req.body)
        })

        // this just cleans the other logs after a post
        setTimeout(() => {
            morgan.token('requested', (req, res, param) => {
                return ''
            })
        })
    }

    if (!body.name) {
        return res.status(400).json({
            error: 'Missing Name'
        })
    }
    if (!body.number) {
        return res.status(400).json({
            error: 'Missing Number'
        })
    }
    if (persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())) {
        return res.status(400).json({
            error: 'Name already exists'
        })
    }

    const newEntry = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 10000000000000000)
    }

    persons = persons.concat(newEntry)
    res.json(newEntry)
    
})


app.delete('/api/persons/:id', (req, res) => {
    // console.log(req.headers)
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})



// LISTEN

const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})