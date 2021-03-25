const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const recetas = require('./routes/recetas')
const app =express()
app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true})




app.use('/recetas',recetas)


//module.exports = app

module.exports = (req,res)=>{
    res.send('Hello Mundo')
}

