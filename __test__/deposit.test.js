const request = require('supertest');
const app = require('../src/app');  
const mongoose = require('mongoose');
const { mongoUri } = require('../globalConfig.json');


const account = {
    name: "Jao",
    cpf: 13611113111,
    email: "joa@gmail.com",
    password: "123456",
    address: {
        street: "Jose Maria Carlos",
        quarter: "Tarcila do Amaral",
        number: 84
    },
    phone: 14999999999
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


describe('Test post deposit', () => {
    it('post route deposit', async () => {
        const res = await request(app).post('/deposit')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({ 
            deposit: 200 
        })
        
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("balance")
        expect(res.statusCode).toEqual(200)
    })

    it('post route error deposit not provide', async () => {
        const res = await request(app).post('/deposit')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        
        expect(res.body).toHaveProperty("error", "O valor do depósito é obrigatório.")
        expect(res.statusCode).toEqual(400)
    })
})
