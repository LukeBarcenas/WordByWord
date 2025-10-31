const mongoose = require('mongoose')

const Schema = mongoose.Schema

const statisticSchema = new Schema({

    words_read: {
        type: Number,
        required: true
    },

    average_wpm: {
        type: Number,
        required: true
    },

    fastest_wpm: {
        type: Number,
        required: true
    },

    longest_text: {
        type: Number,
        required: true
    },

    texts_read: {
        type: Number,
        required: true
    },

    account_id: {
        type: String,
        required: true

    }


}, {timestamps: true})

module.exports = mongoose.model('Statistic', statisticSchema)

