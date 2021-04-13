const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ConfigApiRecetas = mongoose.model('config_api_receta', new Schema ({
    mensajes: {
        forbiddenAccess: String,
        serverError: String,
    }
}))

module.exports = ConfigApiRecetas