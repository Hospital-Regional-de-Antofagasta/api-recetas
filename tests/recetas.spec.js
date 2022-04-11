const app = require("../api/app");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const supertest = require("supertest");
const recetasSeeds = require("./testSeeds/recetasSeeds.json");
const Recetas = require("../api/models/Recetas");
const request = supertest(app);
const { getMensajes } = require("../api/config");
const ConfigApiRecetas = require("../api/models/ConfigApiRecetas");
const configSeed = require("./testSeeds/configSeed.json");

const secreto = process.env.JWT_SECRET;
let token;

beforeEach(async () => {
  //Cerrar la conexión que se crea en el index.
  await mongoose.disconnect();
  //Conectar a la base de datos de prueba.
  await mongoose.connect(`${process.env.MONGO_URI}/recetas_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  //Cargar los seeds a la base de datos.
  await Recetas.create(recetasSeeds);
  await ConfigApiRecetas.create(configSeed);
});

afterEach(async () => {
  //Borrar el contenido de la colleccion en la base de datos despues de la pruebas.
  await Recetas.deleteMany();
  await ConfigApiRecetas.deleteMany();
  //Cerrar la conexión a la base de datos despues de la pruebas.
  await mongoose.connection.close();
});

describe("Endpoints", () => {
  describe("/v1/recetas/recetas-paciente", () => {
    it("Intenta obtener las recetas de un paciente sin token", async () => {
      const respuesta = await request.get("/v1/recetas/recetas-paciente");

      const mensaje = await getMensajes("forbiddenAccess");

      expect(respuesta.status).toBe(401);
      expect(respuesta.body).toEqual({
        respuesta: {
          titulo: mensaje.titulo,
          mensaje: mensaje.mensaje,
          color: mensaje.color,
          icono: mensaje.icono,
        },
      });
    });
    it("Intenta obtener las recetas de un paciente sin recetas", async () => {
      token = jwt.sign(
        {
          _id: "000000000000",
          rut: "22222222-2",
        },
        secreto
      );
      const respuesta = await request
        .get("/v1/recetas/recetas-paciente")
        .set("Authorization", token);
      expect(respuesta.status).toBe(200);
      //Probar que el arreglo está vacío recetas.
      const arregloRecetas = respuesta.body;
      expect(arregloRecetas).toStrictEqual([]);
      expect(arregloRecetas.length).toStrictEqual(0);
    });
    it("Intenta obtener las recetas de un paciente con recetas", async () => {
      token = jwt.sign(
        {
          _id: "000000000000",
          rut: "11111111-1",
        },
        secreto
      );
      const respuesta = await request
        .get("/v1/recetas/recetas-paciente")
        .set("Authorization", token);
      expect(respuesta.status).toBe(200);
      //Probar que el arreglo tiene dos recetas y que ambas son del mismo paciente.
      const recetas = respuesta.body;

      expect(recetas.length).toBe(2);
      // primera receta
      expect(recetas[0].correlativo).toBe(1);
      expect(recetas[0].numeroReceta).toBe(24492986);
      expect(recetas[0].tipoReceta).toBe(5);
      expect(recetas[0].rutPaciente).toBeFalsy();
      expect(recetas[0].medicoPrescriptor).toBe("ALVARO PIZARRO GONZALEZ");
      expect(recetas[0].patologia).toBe("Asma - EPOC");
      expect(recetas[0].recetaRetenida).toBeFalsy();
      expect(Date.parse(recetas[0].fechaEmision)).toBe(
        Date.parse("2021-03-16T04:00:00.000Z")
      );
      expect(recetas[0].codigoEstablecimiento).toBe("HRA");
      expect(recetas[0].nombreEstablecimiento).toBe(
        "Hospital Regional Antofagasta Dr. Leonardo Guzmán"
      );
      // pases primera receta
      // primer pase
      expect(recetas[0].pases[0].numeroReceta).toBe(24492990);
      expect(Date.parse(recetas[0].pases[0].fechaEmisionFutura)).toBe(
        Date.parse("2021-04-16T04:00:00.000Z")
      );
      expect(recetas[0].pases[0].numeroPase).toBe(1);
      // segundo pase
      expect(recetas[0].pases[1].numeroReceta).toBe(24492991);
      expect(Date.parse(recetas[0].pases[1].fechaEmisionFutura)).toBe(
        Date.parse("2021-05-16T04:00:00.000Z")
      );
      expect(recetas[0].pases[1].numeroPase).toBe(2);
      // tercer pase
      expect(recetas[0].pases[2].numeroReceta).toBe(24492992);
      expect(Date.parse(recetas[0].pases[2].fechaEmisionFutura)).toBe(
        Date.parse("2021-06-16T04:00:00.000Z")
      );
      expect(recetas[0].pases[2].numeroPase).toBe(3);
      // cuarto pase
      expect(recetas[0].pases[3].numeroReceta).toBe(24492993);
      expect(Date.parse(recetas[0].pases[3].fechaEmisionFutura)).toBe(
        Date.parse("2021-07-16T04:00:00.000Z")
      );
      expect(recetas[0].pases[3].numeroPase).toBe(4);
      // quinto pase
      expect(recetas[0].pases[4].numeroReceta).toBe(24492994);
      expect(Date.parse(recetas[0].pases[4].fechaEmisionFutura)).toBe(
        Date.parse("2021-08-16T04:00:00.000Z")
      );
      expect(recetas[0].pases[4].numeroPase).toBe(5);
      // medicamentos primera receta
      expect(recetas[0].medicamentos[0].nombreMedicamento).toBe(
        "PARACETAMOL CM 200 MG"
      );
      expect(recetas[0].medicamentos[0].medicamentoControlado).toBeTruthy();
      expect(recetas[0].medicamentos[0].mensaje).toBe(
        "2 cada 6 HRS. por 2 día(s)"
      );
      // segunda receta
      expect(recetas[1].correlativo).toBe(2);
      expect(recetas[1].numeroReceta).toBe(25097726);
      expect(recetas[1].tipoReceta).toBe(5);
      expect(recetas[1].rutPaciente).toBeFalsy();
      expect(recetas[1].medicoPrescriptor).toBe("GABRIEL MARTINEZ FUENTES");
      expect(recetas[1].patologia).toBe(
        "Demencia y Trastornos Mentales Organicos"
      );
      expect(recetas[1].recetaRetenida).toBeTruthy();
      expect(Date.parse(recetas[1].fechaEmision)).toBe(
        Date.parse("2021-02-30T04:00:00.000Z")
      );
      expect(recetas[1].codigoEstablecimiento).toBe("HRA");
      expect(recetas[1].nombreEstablecimiento).toBe(
        "Hospital Regional Antofagasta Dr. Leonardo Guzmán"
      );
      // pases primera receta
      // primer pase
      expect(recetas[1].pases[0].numeroReceta).toBe(25097731);
      expect(Date.parse(recetas[1].pases[0].fechaEmisionFutura)).toBe(
        Date.parse("2021-03-30T03:00:00.000Z")
      );
      expect(recetas[1].pases[0].numeroPase).toBe(1);
      // segundo pase
      expect(recetas[1].pases[1].numeroReceta).toBe(25097732);
      expect(Date.parse(recetas[1].pases[1].fechaEmisionFutura)).toBe(
        Date.parse("2021-04-30T03:00:00.000Z")
      );
      expect(recetas[1].pases[1].numeroPase).toBe(2);
      // tercer pase
      expect(recetas[1].pases[2].numeroReceta).toBe(25097733);
      expect(Date.parse(recetas[1].pases[2].fechaEmisionFutura)).toBe(
        Date.parse("2021-05-30T03:00:00.000Z")
      );
      expect(recetas[1].pases[2].numeroPase).toBe(3);
      // cuarto pase
      expect(recetas[1].pases[3].numeroReceta).toBe(25097734);
      expect(Date.parse(recetas[1].pases[3].fechaEmisionFutura)).toBe(
        Date.parse("2021-06-30T03:00:00.000Z")
      );
      expect(recetas[1].pases[3].numeroPase).toBe(4);
      // quinto pase
      expect(recetas[1].pases[4].numeroReceta).toBe(25097735);
      expect(Date.parse(recetas[1].pases[4].fechaEmisionFutura)).toBe(
        Date.parse("2021-07-30T03:00:00.000Z")
      );
      expect(recetas[1].pases[4].numeroPase).toBe(5);
      // medicamentos primera receta
      expect(recetas[1].medicamentos[0].nombreMedicamento).toBe(
        "PARACETAMOL CM 500 MG"
      );
      expect(recetas[1].medicamentos[0].medicamentoControlado).toBeFalsy();
      expect(recetas[1].medicamentos[0].mensaje).toBe(
        "1 cada 12 HRS. por 3 día(s)"
      );
    });
  });
});
