const Recetas = require('../models/Recetas')
const RecetasDetalles = require('../models/RecetasDetalles')
const {mensajesRecetas} = require ('../config')

exports.getRecetasPaciente = async (req, res) =>{
    try {
        const arregloRecetas = await Recetas.find({
            PAC_PAC_Numero: req.pacPacNumero
        })    
        .exec()
        res.status(200).send(arregloRecetas)
    } catch (error) {
        res.status(500).send({ respuesta: mensajesRecetas.serverError})
    }
}

exports.getDetallesReceta = async (req, res) =>{
    try {
        const recetaConDetalles = await  Promise.all([
            Recetas.findOne({
                Fld_NroRecetaOriginal:req.params.numero,
                Fld_TipoRecetOriginal:req.params.tipo
            }).exec(),
            RecetasDetalles.findOne({
                Fld_NroRecetaOriginal:req.params.numero,
                Fld_TipoRecetOriginal:req.params.tipo
            }).exec()           
        ])
        if (recetaConDetalles[0] === null || recetaConDetalles[1] === null) {
            res.sendStatus(200)
            return
        }
        const recetaDetallada = {
            Fld_NroRecetaOriginal: recetaConDetalles[0]['Fld_NroRecetaOriginal'],
            Fld_TipoRecetOriginal:recetaConDetalles[0]['Fld_TipoRecetOriginal'],
            Fld_FechaDigit:recetaConDetalles[0]['Fld_FechaDigit'],            
            Fld_MedicoPrescriptor:recetaConDetalles[0]['Fld_MedicoPrescriptor'],
            PAC_PAC_Numero:recetaConDetalles[0]['PAC_PAC_Numero'],
            Fld_PatologiaCronica:recetaConDetalles[0]['Fld_PatologiaCronica'],
            Pases:recetaConDetalles[0]['Pases'],
            Medicamentos:recetaConDetalles[1]['Medicamentos']           
        }
        res.status(200).send(recetaDetallada)
    } catch (error) {
        res.status(500).send({ respuesta: mensajesRecetas.serverError})
    }
}


