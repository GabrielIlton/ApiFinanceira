const request = require('supertest');
const app = require('../src/app');  
const mongoose = require('mongoose');
const { mongoUri } = require('../globalConfig.json');


const account = {
    name: "Joao",
    cpf: 11011111111,
    email: "joaoss@gmail.com",
    password: "123456",
    address: {
        street: "Jose Maria Carlos",
        quarter: "Tarcila do Amaral",
        number: 84
    },
    phone: 14999999999,
    admin: true
}

beforeAll(
    async () => {
        await mongoose.connect(mongoUri, { useNewUrlParser: true })

        await request(app).post('/create')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send( account )

        const resLogin = await request(app).post('/login')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            email: account.email,
            password: account.password
        })
        token = resLogin.body.token
    }
);

afterAll(
    async () => {
        await request(app).put('/password')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({ 
            passwordOld: "654321", 
            email: "joaoss@gmail.com",
            passwordNew: "123456" 
        })
        await mongoose.connection.close()
        console.log('desconectou');
    }
);

describe('Test put password', () => {
    it('put route password', async () => {
        const res = await request(app).put('/password')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({ 
            passwordOld: "123456", 
            email: "joaoss@gmail.com",
            passwordNew: "654321" 
        })
        
        expect(res.body).toHaveProperty("name", "Joao")
        expect(res.body).toHaveProperty("message", "Senha alterada com sucesso.")
        expect(res.statusCode).toEqual(200)
    })
})
