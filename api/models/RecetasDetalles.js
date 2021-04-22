const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RecetasDetalles =mongoose.model('recetas_detalle', new Schema({
    Fld_NroRecetaOriginal: Number,
    Fld_TipoRecetOriginal: Number,
    Medicamentos: [
        {
            FLD_MATNOMBRE: String,
            Fld_Dosis: Number,
            Fld_Dias: Number,
            Fld_CantDias: Number
        }
    ]
}))

module.exports = RecetasDetalles