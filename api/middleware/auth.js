const jwt = require('jsonwebtoken')
const {mensajesRecetas} = require ('../config')
const secreto = process.env.JWT_SECRET

const estaAutenticado = (req, res, next) => {
    const token = req.headers.authorization
    if(!token){
        return res.status(403).send({respuesta: mensajesRecetas.forbiddenAccess})
    }
    jwt.verify(token, secreto, (error, decoded) => {
        if (error) {
            return res.status(403).send({respuesta: mensajesRecetas.forbiddenAccess})
        }
        const {_id, PAC_PAC_Numero} =  decoded
        req.idPaciente = _id
        req.pacPacNumero = PAC_PAC_Numero
        next()
    })
}

module.exports = estaAutenticado