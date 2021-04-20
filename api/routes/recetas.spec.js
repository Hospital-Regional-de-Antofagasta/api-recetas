const app = require('../index')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const supertest = require("supertest")
const recetasSeeds = require('../testSeeds/recetasSeeds.json')
const recetasDetallesSeeds = require('../testSeeds/recetasDetallesSeeds.json')
const Recetas = require('../models/Recetas')
const RecetasDetalles = require('../models/RecetasDetalles')
const request = supertest(app)
const secreto = process.env.JWT_SECRET
let token


beforeAll(async done =>{
    //Cerrar la conexión que se crea en el index.
    await mongoose.disconnect();
    //Conectar a la base de datos de prueba.
    await mongoose.connect(`${process.env.MONGO_URI_TEST}recetas_test`, { useNewUrlParser: true, useUnifiedTopology: true })
    done()
})


afterAll(async (done) => {
    //Cerrar la conexión a la base de datos despues de la pruebas.
    await mongoose.connection.close()
    done()
})

beforeEach(async () => {
    //Cargar los seeds a la base de datos.
    for (const recetaSeed of recetasSeeds) {
        await Promise.all([
            Recetas.create(recetaSeed),
        ])
    }
    for (const recetaDetallesSeed of recetasDetallesSeeds) {
        await Promise.all([
            RecetasDetalles.create(recetaDetallesSeed),
        ])
    }    
})

afterEach(async () => {
    //Borrar el contenido de la colleccion en la base de datos despues de la pruebas.
    await Recetas.deleteMany()
    await RecetasDetalles.deleteMany()
})

describe('Endpoints', () => {
    describe('Recetas', () => {
        it('Intenta obtener las recetas de un paciente sin token', async done =>{ 
            const respuesta = await request.get('/recetas/recetas_paciente')      
            expect(respuesta.status).toBe(403)
            expect(respuesta.body.respuesta).toBeTruthy()
            done()
        })
        it('Intenta obtener las recetas de un paciente con token (Arreglo sin recetas)', async done =>{            
            token = jwt.sign({PAC_PAC_Numero: 2}, secreto)
            const respuesta = await request.get('/recetas/recetas_paciente')
                .set('Authorization',token)      
            expect(respuesta.status).toBe(200)
            //Probar que el arreglo está vacío recetas.
            const arregloRecetas=respuesta.body
            expect(arregloRecetas).toStrictEqual([])
            expect(arregloRecetas.length).toStrictEqual(0)
            done()
        })
        it('Intenta obtener las recetas de un paciente con token (Arreglo con recetas)', async done =>{            
            token = jwt.sign({PAC_PAC_Numero: 1}, secreto)
            const respuesta = await request.get('/recetas/recetas_paciente')
                .set('Authorization',token)
            expect(respuesta.status).toBe(200)  
            //Probar que el arreglo tiene dos recetas y que ambas son del mismo paciente.
            const arregloRecetas = respuesta.body
            
            const primeraReceta = arregloRecetas[0]
            const numeroPacientePrimeraReceta = primeraReceta.PAC_PAC_Numero
            const numeroPrimeraRecetaOriginal = primeraReceta.Fld_NroRecetaOriginal
            const tipoPrimeraRecetaOriginal = primeraReceta.Fld_TipoRecetOriginal
           
            const segundaReceta = arregloRecetas[1]
            const numeroPacienteSegundaReceta = segundaReceta.PAC_PAC_Numero
            const numeroSegundaRecetaOriginal = segundaReceta.Fld_NroRecetaOriginal
            const tipoSegundaRecetaOriginal = segundaReceta.Fld_TipoRecetOriginal
            

            expect(arregloRecetas.length).toStrictEqual(2)

            expect(numeroPacientePrimeraReceta).toStrictEqual(1)
            expect(numeroPrimeraRecetaOriginal).toStrictEqual(24492986)
            expect(tipoPrimeraRecetaOriginal).toStrictEqual(5)

            expect(numeroPacienteSegundaReceta).toStrictEqual(1)
            expect(numeroSegundaRecetaOriginal).toStrictEqual(25097726)
            expect(tipoSegundaRecetaOriginal).toStrictEqual(5)
            done()
        })         
    })
    describe('Detalles de Recetas', () => {        
        it('Intenta obtener los detalles de una receta sin token', async done =>{
            const respuesta = await request.get('/recetas/detalles_receta/25097726&5')            
            expect(respuesta.status).toBe(403)
            expect(respuesta.body.respuesta).toBeTruthy()
            done()
        })
        it('Intenta obtener los detalles de una receta con token (No existe la receta y/o los detalles)', async done =>{
            const respuesta = await request.get('/recetas/detalles_receta/25097727&5')
                .set('Authorization',token)          
            expect(respuesta.status).toBe(200)   
            //Al no existir la receta o los detalles, se recibe un objeto vacio.
            const detallesReceta=respuesta.body 
            expect(detallesReceta).toStrictEqual({})
            done()
        })
        it('Intenta obtener los detalles de una receta con token (Existe la receta y los detalles)', async done =>{
            const respuesta = await request.get('/recetas/detalles_receta/25097726&5')
                .set('Authorization',token)             
            expect(respuesta.status).toBe(200)
            //Al existir la receta y los detalles, el objeto resultante debe tener el número y tipo de la receta solicitada.
            const detallesReceta=respuesta.body  
            const numeroRecetaOriginal = detallesReceta.Fld_NroRecetaOriginal
            const tipoRecetaOriginal = detallesReceta.Fld_TipoRecetOriginal
            expect(numeroRecetaOriginal).toStrictEqual(25097726)
            expect(tipoRecetaOriginal).toStrictEqual(5)
            done()
        })        
    })
})