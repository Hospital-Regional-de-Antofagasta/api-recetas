const jwt = require('jsonwebtoken')

const estaAutenticado = (req, res, next) => {
    const token = req.headers.authorization
    if(!token){
        return res.sendStatus(403)
    }
    jwt.verify(token, 'mi-secreto', (err, decoded) => {
        const {_id} =  decoded
        req.idPaciente = _id
        next()
    })
}



module.exports = estaAutenticado