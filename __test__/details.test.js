const request = require('supertest');
const app = require('../src/app');  
const mongoose = require('mongoose');
const { mongoUri } = require('../globalConfig.json');


const account = {
    name: "Joao",
    cpf: 11111111111,
    email: "joao@gmail.com",
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
        const res = await request(app).post('/login')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            email: "joao@gmail.com",
            password: "123456"
        })
        token = res.body.token

        await request(app).delete('/delete')
        .set('Authorization', `Bearer ${token}`)
        .send({
            cpf: 11111111111
        })
        await mongoose.connection.close()
        console.log('desconectou');
    }
);

describe('Test get details', () => {
    it('get route details', async () => {
        const res = await request(app).get('/details')
        .set('Authorization', `Bearer ${token}`)
        
        expect(res.body).toHaveProperty("finalReturn")
        expect(res.statusCode).toEqual(200)
    })
})
