const express = require('express')
const Recetas = require('../models/Recetas')
const RecetasDetalles = require('../models/Recetas_detalles')
const{estaAutenticado} = require('../auth')

const router = express.Router()

router.get('/recetas_paciente/:id', (req, res) =>{
    Recetas.findById(req.params.id)//
        .exec()
        .then(x => res.status(200).send(x))
})

router.get('/detalles_receta/:id1&:id2', (req, res) =>{
    Ordenes.findById(req.params.id)
        .exec()
        .then(x => res.status(200).send(x))
})



module.exports = router