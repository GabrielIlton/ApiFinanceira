const request = require('supertest');
const app = require('../src/app');  
const mongoose = require('mongoose');
const { mongoUri } = require('../globalConfig.json');


const account = {
    name: "Bia",
    cpf: 96111111111,
    email: "bia@gmail.com",
    password: "123456",
    address: {
        street: "Jose Maria Carlos",
        quarter: "Tarcila do Amaral",
        number: 84
    },
    phone: 14999999999
}

const accountNotStatement = {
    name: "Carla",
    cpf: 11111111881,
    email: "carla@gmail.com",
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

        await request(app).post('/deposit')
        .set('Accept', 'aplication/json')
        .expect('Content-Type', /json/)
        .set('Authorization', `Bearer ${token}`)
        .send({
            deposit: 100
        })

        await request(app).post('/create')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send( accountNotStatement )

        const resLoginnotStatement = await request(app).post('/login')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            email: accountNotStatement.email,
            password: accountNotStatement.password
        })
        tokenNotStatement = resLoginnotStatement.body.token
    }
);

afterAll(
    async () => {
        await mongoose.connection.close()
        console.log('desconectou');
    }
);


describe('Test statement', () => {
    it('get route statement', async () => {
        const res = await request(app).get('/statement')
        .set('Authorization', `Bearer ${token}`)
        
        expect(res.body).toHaveProperty("accountStatement")
        expect(res.statusCode).toBe(200)
    })

    it('get route statement undefined', async () => {
        token = tokenNotStatement
        const res = await request(app).get('/statement')
        .set('Authorization', `Bearer ${token}`)
        
        expect(res.body).toHaveProperty("error", "Você não tem nenhuma transação.")
        expect(res.statusCode).toBe(404)
    })
})
