const app = require("../index");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const supertest = require("supertest");
const recetasSeeds = require("../testSeeds/recetasSeeds.json");
const recetasDetallesSeeds = require("../testSeeds/recetasDetallesSeeds.json");
const Recetas = require("../models/Recetas");
const RecetasDetalles = require("../models/RecetasDetalles");
const request = supertest(app);
const secreto = process.env.JWT_SECRET;
let token;

beforeAll(async (done) => {
  //Cerrar la conexión que se crea en el index.
  await mongoose.disconnect();
  //Conectar a la base de datos de prueba.
  await mongoose.connect(`${process.env.MONGO_URI_TEST}recetas_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
   //Cargar los seeds a la base de datos.
   for (const recetaSeed of recetasSeeds) {
    await Promise.all([Recetas.create(recetaSeed)]);
  }
  for (const recetaDetallesSeed of recetasDetallesSeeds) {
    await Promise.all([RecetasDetalles.create(recetaDetallesSeed)]);
  }
  done();
});

afterAll(async (done) => {
  //Borrar el contenido de la colleccion en la base de datos despues de la pruebas.
  await Recetas.deleteMany();
  await RecetasDetalles.deleteMany();
  //Cerrar la conexión a la base de datos despues de la pruebas.
  await mongoose.connection.close();
  done();
});


describe("Endpoints", () => {
  describe("Recetas", () => {
    it("Intenta obtener las recetas de un paciente sin token", async (done) => {
      const respuesta = await request.get("/v1/recetas/recetas_paciente");
      expect(respuesta.status).toBe(401);
      expect(respuesta.body.respuesta).toBeTruthy();
      done();
    });
    it("Intenta obtener las recetas de un paciente con token (Arreglo sin recetas)", async (done) => {
      token = jwt.sign({ numeroPaciente: 2 }, secreto);
      const respuesta = await request
        .get("/v1/recetas/recetas_paciente")
        .set("Authorization", token);
      expect(respuesta.status).toBe(200);
      //Probar que el arreglo está vacío recetas.
      const arregloRecetas = respuesta.body;
      expect(arregloRecetas).toStrictEqual([]);
      expect(arregloRecetas.length).toStrictEqual(0);
      done();
    });
    it("Intenta obtener las recetas de un paciente con token (Arreglo con recetas)", async (done) => {
      token = jwt.sign({ numeroPaciente: 1 }, secreto);
      const respuesta = await request
        .get("/v1/recetas/recetas_paciente")
        .set("Authorization", token);
      expect(respuesta.status).toBe(200);
      //Probar que el arreglo tiene dos recetas y que ambas son del mismo paciente.
      const arregloRecetas = respuesta.body;

      const primeraReceta = arregloRecetas[0];
      const primerPase = primeraReceta.pases[0];
      const segundoPase = primeraReceta.pases[1];

      const segundaReceta = arregloRecetas[1];
      const tercerPase = segundaReceta.pases[0];

      expect(arregloRecetas.length).toStrictEqual(2);

      expect(primeraReceta.numeroPaciente).toStrictEqual(1);
      expect(primeraReceta.numeroRecetaOriginal).toStrictEqual(24492986);
      expect(primeraReceta.tipoRecetaOriginal).toStrictEqual(5);
      expect(primeraReceta.recetaRetenida).toStrictEqual(false);
      expect(primeraReceta.pases.length).toStrictEqual(2);
      expect(primerPase.numeroReceta).toStrictEqual(24492990);
      expect(primerPase.numeroPase).toStrictEqual(5);
      expect(segundoPase.numeroReceta).toStrictEqual(24492991);
      expect(segundoPase.numeroPase).toStrictEqual(6);

      expect(segundaReceta.numeroPaciente).toStrictEqual(1);
      expect(segundaReceta.numeroRecetaOriginal).toStrictEqual(25097726);
      expect(segundaReceta.tipoRecetaOriginal).toStrictEqual(5);
      expect(segundaReceta.recetaRetenida).toStrictEqual(false);
      expect(segundaReceta.pases.length).toStrictEqual(1);
      expect(tercerPase.numeroReceta).toStrictEqual(25097731);
      expect(tercerPase.numeroPase).toStrictEqual(6);
      done();
    });
  });
  describe("Detalles de Recetas", () => {
    it("Intenta obtener los detalles de una receta sin token", async (done) => {
      const respuesta = await request.get(
        "/v1/recetas/detalles_receta/25097726&5"
      );
      expect(respuesta.status).toBe(401);
      expect(respuesta.body.respuesta).toBeTruthy();
      done();
    });
    it("Intenta obtener los detalles de una receta con token (No existe la receta y/o los detalles)", async (done) => {
      token = jwt.sign({ numeroPaciente: 1 }, secreto);
      const respuesta = await request
        .get("/v1/recetas/detalles_receta/25097727&5")
        .set("Authorization", token);
      expect(respuesta.status).toBe(200);
      //Al no existir la receta o los detalles, se recibe un objeto vacio.
      const detallesReceta = respuesta.body;
      expect(detallesReceta).toStrictEqual({});
      done();
    });
    it("Intenta obtener los detalles de una receta con token (Existe la receta y los detalles)", async (done) => {
      token = jwt.sign({ numeroPaciente: 1 }, secreto);
      const respuesta = await request
        .get("/v1/recetas/detalles_receta/25097726&5")
        .set("Authorization", token);
      expect(respuesta.status).toBe(200);
      //Al existir la receta y los detalles, el objeto resultante debe tener el número y tipo de la receta solicitada.
      const detallesReceta = respuesta.body;
      const medicamentos = detallesReceta.medicamentos;
      expect(detallesReceta.numeroRecetaOriginal).toStrictEqual(25097726);
      expect(detallesReceta.tipoRecetaOriginal).toStrictEqual(5);
      expect(medicamentos.length).toStrictEqual(1);
      expect(medicamentos[0].nombreMaterial).toStrictEqual(
        "PARACETAMOL CM 200 MG"
      );
      expect(medicamentos[0].dosis).toStrictEqual(2);
      expect(medicamentos[0].dias).toStrictEqual(2);
      expect(medicamentos[0].cantidadDias).toStrictEqual(4);
      expect(medicamentos[0].medicamentoControlado).toStrictEqual(true);
      done();
    });
  });
});
