const ConfigApiRecetas = require('./models/ConfigApiRecetas')

let mensajesRecetas = {
    forbiddenAccess: 'No tiene la autorización para realizar esta acción.',
    serverError: 'Se produjo un error.',
}

const loadConfig = async () => {
    try {
        const config = await ConfigApiRecetas.findOne().exec()
        mensajesRecetas = config.mensajesRecetas
    } catch (error) {

    }
}

module.exports = {
    loadConfig,
    mensajesRecetas
 }