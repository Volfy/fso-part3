// node mongo.js password "Anna blabla" 030-222
// > added Anna blabla number 030-222 to phonebook

// node mongo.js password
// > phonebook:
// > Anna blabla 030-222
// > ...

const e = require('express')
const mongoose = require('mongoose')

// No password
if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = 
`mongodb+srv://fsopart3:${password}@cluster0.lqnhttt.mongodb.net/phonebookData?retryWrites=true&w=majority`  

mongoose.set('strictQuery', false)
mongoose.connect(url)

const numberSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Number = mongoose.model('Number', numberSchema)


// Only password
if (process.argv.length===3) {
    //console.log('CASE PASSWORD GIVEN')
    Number
        .find({})
        .then(res => {
            console.log('Phonebook:')
            res.forEach(number => {
                console.log(number.name,'\t', number.number)
            })
            mongoose.connection.close()
            process.exit(1)
        })
} 
// password and new entry
else if (process.argv.length===5) {
    //console.log('CASE 5 things')
    const newEntry = new Number({
        name: process.argv[3],
        number: process.argv[4],
    })
    newEntry
        .save()
        .then(res => {
            console.log(
                `added ${newEntry.name} number ${newEntry.number} to phonebook`)
            mongoose.connection.close()
            process.exit(1)
        })
} 
// clarify usage
else {
    console.log('Missing arguments. To add a new entry: \n',
    'node mongo.js <password> <name> <number>\n',
    'node mongo.js <password> "<name> <surname>" <number>\n',
    'To get the full list of numbers: \n',
    'node mongo.js <password>\n')
    process.exit(1)
}