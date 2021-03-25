const express = require('express')
const Recetas = require('../models/Recetas')
const RecetasDetalles = require('../models/Recetas_detalles')
const{estaAutenticado} = require('../auth')

const router = express.Router()

router.get('/recetas_paciente/:id', (req, res) =>{
    Recetas.where('PAC_PAC_Numero').gte(req.params.id)
        .exec()
        .then(x => res.status(200).send(x))
})

router.get('/detalles_receta/:id1&:id2', (req, res) =>{
    RecetasDetalles.where('Fld_NroRecetaOriginal').gte(req.params.id1)
        .where('Fld_TipoRecetOriginal').gte(req.params.id2)
        .exec()
        .then(x => res.status(200).send(x))
})



module.exports = router