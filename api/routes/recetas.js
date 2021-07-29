const express = require("express");
const recetasController = require("../controllers/recetasController");
const isAuthenticated = require("../middleware/auth");
const router = express.Router();

router.get(
  "/recetas-paciente",
  isAuthenticated,
  recetasController.getRecetasPaciente
);

module.exports = router;
