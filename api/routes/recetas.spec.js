const app = require('../index')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const supertest = require("supertest")
const request = supertest(app)
const secreto = process.env.JWT_SECRET
let token


beforeAll(async done =>{
    //Cerrar la conexión que se crea en el index.
    await mongoose.disconnect();
    //Conectar a la base de datos de prueba.
    await mongoose.connect(`${process.env.MONGO_URI_TEST}recetasTest`, { useNewUrlParser: true, useUnifiedTopology: true })
    token= jwt.sign(1, secreto)
    done()
})


afterAll(async (done) => {
    // cerrar la coneccion a la bd
    await mongoose.connection.close()
    done()
})

describe('Endpoints', () => {
    describe('recetas', () => {
        it('Intenta obtener las recetas de un paciente sin token', async done =>{ 
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            }
            const respuesta= await request.get('/recetas/recetas_paciente/1',{},res)       
            expect(respuesta.status).toBe(403)
            done()
        })
        it('Intenta obtener las recetas de un paciente con token', async done =>{            
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                next: jest.fn(),
                estaAutenticado: jest.fn().mockReturnValue(1)
            }
            const respuesta= await request.get('/recetas/recetas_paciente/1',{},res)
                .set('Authorization',token)       
            expect(respuesta.status).toBe(200)
            done()
        })        
    })
    describe('detallesRecetas', () => {
        it('Intenta obtener los detalles de una receta sin token', async done =>{
            const res= await request.get('/recetas/detalles_receta/:1234&:5')            
            expect(res.status).toBe(403)
            done()
        })
    })
})