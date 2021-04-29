const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Recetas =mongoose.model('receta', new Schema({
    numeroRecetaOriginal: Number,
    tipoRecetaOriginal: Number,
    medicoPrescriptor: String,
    numeroPaciente: Number,
    patologiaCronica: String,
    pases: [
        {
            numeroReceta: Number,
            fechaEmision: Date,
            numeroPase: Number
        }
    ]
}))

module.exports = Recetas