const {request, response} = require('express')
const express = require('express')
const app = express()

app.use(express.json())

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

app.get('/', (request, response) => {
    console.log(request.headers)
    response.send('<h1>Phonebook</h1><br>' +
                '<em>/info</em> for general info<br>' +
                '<em>/api/persons</em> for all persons<br>' +
                '<em>/api/persons/(id)</em> for specific entry<br>')
})

app.get('/info', (request, response) => {
    // console.log(request.headers)
    response.send(`Phonebook has info on ${persons.length} people. <br>${new Date()}`)
})


app.get('/api/persons', (request, response) => {
    // console.log(request.headers)
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    // console.log(request.headers)
    const id = Number(request.params.id)
    const selected = persons.find(p => p.id === id)
    if (selected) {
        response.json(selected)
    } else {
        response.status(404).send(`404 ID ${id} Not Found`)
    }
})


app.post('/api/persons', (request, response) => {
    console.log(request.headers)
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'Missing Name'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'Missing Number'
        })
    }
    if (persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())) {
        return response.status(400).json({
            error: 'Name already exists'
        })
    }

    const newEntry = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 10000000000000000)
    }

    persons = persons.concat(newEntry)
    response.json(newEntry)
})


app.delete('/api/persons/:id', (request, response) => {
    // console.log(request.headers)
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})



// LISTEN

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})