const app = require("../index");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const supertest = require("supertest");
const recetasSeeds = require("../testSeeds/recetasSeeds.json");
const Recetas = require("../models/Recetas");
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
  await Recetas.create(recetasSeeds);
  done();
});

afterAll(async (done) => {
  //Borrar el contenido de la colleccion en la base de datos despues de la pruebas.
  await Recetas.deleteMany();
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
      const medicamentosPrimeraReceta = primeraReceta.medicamentos;

      const segundaReceta = arregloRecetas[1];
      const tercerPase = segundaReceta.pases[0];
      const medicamentosSegundaReceta = segundaReceta.medicamentos;

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
      expect(medicamentosPrimeraReceta.length).toStrictEqual(1);
      expect(medicamentosPrimeraReceta[0].nombreMaterial).toStrictEqual(
        "PARACETAMOL CM 200 MG"
      );
      expect(medicamentosPrimeraReceta[0].dosis).toStrictEqual(2);
      expect(medicamentosPrimeraReceta[0].dias).toStrictEqual(2);
      expect(medicamentosPrimeraReceta[0].cantidadDias).toStrictEqual(4);
      expect(medicamentosPrimeraReceta[0].medicamentoControlado).toStrictEqual(
        true
      );

      expect(segundaReceta.numeroPaciente).toStrictEqual(1);
      expect(segundaReceta.numeroRecetaOriginal).toStrictEqual(25097726);
      expect(segundaReceta.tipoRecetaOriginal).toStrictEqual(5);
      expect(segundaReceta.recetaRetenida).toStrictEqual(true);
      expect(segundaReceta.pases.length).toStrictEqual(1);
      expect(tercerPase.numeroReceta).toStrictEqual(25097731);
      expect(tercerPase.numeroPase).toStrictEqual(6);
      expect(medicamentosSegundaReceta.length).toStrictEqual(1);
      expect(medicamentosSegundaReceta[0].nombreMaterial).toStrictEqual(
        "PARACETAMOL CM 500 MG"
      );
      expect(medicamentosSegundaReceta[0].dosis).toStrictEqual(1);
      expect(medicamentosSegundaReceta[0].dias).toStrictEqual(3);
      expect(medicamentosSegundaReceta[0].cantidadDias).toStrictEqual(2);
      expect(medicamentosSegundaReceta[0].medicamentoControlado).toStrictEqual(
        false
      );

      done();
    });
  });
});
