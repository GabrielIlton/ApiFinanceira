const request = require('supertest');
const app = require('../src/app');  
const mongoose = require('mongoose');
const { mongoUri } = require('../globalConfig.json');

const account = {
    name: "Joaou",
    cpf: 11111111911,
    email: "joaou@gmail.com",
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
        await mongoose.connection.close()
        console.log('desconectou');
    }
);

describe( 'Test get balance', () => {
    it('get route balance', async () => {
        const res = await request(app).get('/balance')
        .set('Authorization', `Bearer ${token}`)
        
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("balance")
        expect(res.statusCode).toEqual(200)
    })
})