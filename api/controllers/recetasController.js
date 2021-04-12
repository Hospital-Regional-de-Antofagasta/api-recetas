const Recetas = require('../models/Recetas')
const RecetasDetalles = require('../models/RecetasDetalles')

exports.getRecetasPaciente = (req, res) =>{
    try {
        Recetas.find({
            PAC_PAC_Numero: req.params.numero
        })    
        .exec()
        .then(arregloRecetas => res.status(200).send(arregloRecetas))
    } catch (error) {
        res.status(500).send('Recetas: ' + error + ' - ' + error.message)
    }
}

exports.getDetallesReceta = (req, res) =>{
    try {
        Promise.all([
            Recetas.findOne({
                Fld_NroRecetaOriginal:req.params.numero,
                Fld_TipoRecetOriginal:req.params.tipo
            }).exec(),
            RecetasDetalles.findOne({
                Fld_NroRecetaOriginal:req.params.numero,
                Fld_TipoRecetOriginal:req.params.tipo
            }).exec()           
        ])
        .then(recetaConDetalles => {
            if (recetaConDetalles[0] === null || recetaConDetalles[1] === null) {
                res.status(200).send({})
                return
            }
            const recetaDetallada ={
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
        })
    } catch (error) {
        res.status(500).send('Detalles Receta: ' + error + ' - ' + error.message)
    }
}


