//const {req, res} = require('express')
const express = require('express')

const cors = require('cors')
const app = express()
let morgan;

app.use(cors())
app.use(express.json())
app.use(express.static('build'))


if (process.env.NODE_ENV !== 'production') {
    morgan = require('morgan')
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requested'))
    morgan.token('requested', (reqS, resS, param) => {
        return ''
    })
}


// Persons

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// RESTful/CRUD

app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1><br>' +
                '<em>/info</em> for general info<br>' +
                '<em>/api/persons</em> for all persons<br>' +
                '<em>/api/persons/(id)</em> for specific entry<br>')
})

app.get('/info', (req, res) => {
    // console.log(req.headers)
    res.send(`Phonebook has info on ${persons.length} people. <br>${new Date()}`)
})


app.get('/api/persons', (req, res) => {
    // console.log(req.headers)
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    // console.log(req.headers)
    const id = Number(req.params.id)
    const selected = persons.find(p => p.id === id)
    if (selected) {
        res.json(selected)
    } else {
        res.status(404).send(`404 ID ${id} Not Found`)
    }
})


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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})