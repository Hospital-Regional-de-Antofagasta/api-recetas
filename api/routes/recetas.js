const express = require('express')
const Recetas = require('../models/Recetas')
const RecetasDetalles = require('../models/Recetas_detalles')
//const{estaAutenticado} = require('../auth')
//Recetas.find({PAC_PAC_Numero: req.params.numero})
const router = express.Router()

router.get('/recetas_paciente/:numero', async (req, res) =>{
    console.log(req.params.numero)
        
    await Recetas.find({
        PAC_PAC_Numero: req.params.numero
    })    
    .exec()
    .then(x => res.status(200).send(x))
       
})

router.get('/detalles_receta/:numero&:tipo', async(req, res) =>{
    console.log(req.params.numero)
    console.log(req.params.tipo)
    Promise.all([
        await Recetas.findOne({
            Fld_NroRecetaOriginal:req.params.numero,
            Fld_TipoRecetOriginal:req.params.tipo
        }).exec(),
        await RecetasDetalles.findOne({
            Fld_NroRecetaOriginal:req.params.numero,
            Fld_TipoRecetOriginal:req.params.tipo
        }).exec()           
    ])
    .then(x => {
        const algo ={
            Fld_NroRecetaMadre: x[0]['Fld_NroRecetaOriginal'],
            Fld_TipoRecet: x[0]['Fld_TipoRecetOriginal'],
            Fld_FechaDigit:x[0]['Fld_FechaDigit'],            
            Fld_MedicoPrescriptor:x[0]['Fld_MedicoPrescriptor'],
            PAC_PAC_Numero: x[0]['PAC_PAC_Numero'],
            Fld_PatologiaCronica: x[0]['Fld_PatologiaCronica'],
            Pases:x[0]['Pases'],
            Medicamentos:x[1]['Medicamentos']           
        }
        console.log(algo)
        res.status(200).send(algo)
    })
})



module.exports = router