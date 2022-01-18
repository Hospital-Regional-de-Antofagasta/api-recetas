const Recetas = require("../models/Recetas");
const { getMensajes } = require("../config");

exports.getRecetasPaciente = async (req, res) => {
  try {
    const recetas = await Recetas.find({
      rutPaciente: req.rut,
    }).exec();
    res.status(200).send(recetas);
  } catch (error) {
    if (process.env.NODE_ENV === "dev")
      return res.status(500).send({
        respuesta: await getMensajes("serverError"),
        detalles_error: {
          nombre: error.name,
          mensaje: error.message,
        },
      });
    res.status(500).send({ respuesta: await getMensajes("serverError") });
  }
};
