const jwt = require('jsonwebtoken')
const secreto = process.env.JWT_SECRET

const estaAutenticado = (req, res, next) => {
    const token = req.headers.authorization
    if(!token){
        return res.sendStatus(403)
    }
    jwt.verify(token, secreto, (error, decoded) => {
        if (error) {
            return res.sendStatus(403)
            //return res.status(403).send(error)
        }
        const {_id} =  decoded
        req.idPaciente = _id
        next()
    })
}

module.exports = estaAutenticado