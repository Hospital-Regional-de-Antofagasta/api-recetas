const express = require("express");
const recetasController = require("../controllers/recetasController");
const estaAutenticado = require("../middleware/auth");
const router = express.Router();

router.get(
  "/recetas_paciente",
  estaAutenticado,
  recetasController.getRecetasPaciente
);

module.exports = router;
