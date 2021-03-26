const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const recetas = require('./routes/recetas')
const app =express()
app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true})


 app.use('/recetas',recetas)


 app.get('/a', (req, res) => {
    res.send('El index funciona.')
})

module.exports = app
