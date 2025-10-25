require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const accountRoutes = require('./routes/account')

const app = express()

app.use(express.json())
app.use((req, res, next) => {

    console.log(req.path, req.method)
    next()

})

app.use('/api/account', accountRoutes)

mongoose.connect(process.env.MONGO_URL)
    .then(() => {

        // Listen for requests
        app.listen(process.env.PORT, () => {
        console.log('Connected to DB & Listening on port', process.env.PORT)
})

    })
    .catch((error) => {
        console.log(error)
    })

