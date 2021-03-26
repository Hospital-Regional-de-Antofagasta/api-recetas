const jwt = require('jsonwebtoken')
const Usuarios = require('../models/Usuarios')

const estaAutenticado = (req, res, next) => {
    const token = req.headers.authorization
    if(!token){
        return res.sendStatus(403)
    }
    jwt.verify(token, 'mi-secreto', (err, decoded) => {
        const {_id} =  decoded
        Usuarios.findOne({_id}).exec()
            .then(usuario => {
                req.usuario = usuario
                next()
            })
    })
}

const tieneRoles = roles => (req, res, next) => {
    if(roles.indexOf(req.usuario.rol) > -1){
        return next()
    }
    res.sendStatus(403)
}

module.exports = {
    estaAutenticado,
    tieneRoles,
}