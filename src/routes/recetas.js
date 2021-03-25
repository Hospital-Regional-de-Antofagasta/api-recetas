const express = require('express')
const Recetas = require('../models/Recetas')
const RecetasDetalles = require('../models/Recetas_detalles')
const{estaAutenticado} = require('../auth')

const router = express.Router()

router.get('/recetas_paciente/{numero}', (req, res) =>{
    Recetas.where('PAC_PAC_Numero').gte(req.params.numero)
        .exec()
        .then(x => res.status(200).send(x))
})

router.get('/detalles_receta/{numero}/{tipo}}', (req, res) =>{
    RecetasDetalles.where('Fld_NroRecetaOriginal').gte(req.params.numero)
        .where('Fld_TipoRecetOriginal').gte(req.params.tipo)
        .exec()
        .then(x => res.status(200).send(x))
})



module.exports = router