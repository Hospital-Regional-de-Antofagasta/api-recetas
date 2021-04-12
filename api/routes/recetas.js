const express = require('express')
const recetasController = require('../controllers/recetasController')
const estaAutenticado = require('../middleware/auth')
const router = express.Router()

router.get('/recetas_paciente/:numero',estaAutenticado, recetasController.getRecetasPaciente)

router.get('/detalles_receta/:numero&:tipo',estaAutenticado, recetasController.getDetallesReceta)



module.exports = router