const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)

const numberSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: (v) => {
                return /^\d{2}-\d{6,}$|^\d{3}-\d{5,}$|^\d{8,}$/.test(v)
            },
            message: props => `${props.value} is not a valid phone number.`
        },
        required: true
    }
})

numberSchema.set('toJSON', {
    transform: (document, returned) => {
        returned.id = returned._id.toString()
        delete returned._id
        delete returned.__v
    }
})

module.exports = mongoose.model('Number', numberSchema)