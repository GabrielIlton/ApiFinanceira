const request = require('supertest');
const app = require('../src/app');  
const mongoose = require('mongoose');
const { mongoUri } = require('../globalConfig.json');


const account = {
    name: "Jaozinho",
    cpf: 13611113181,
    email: "joazinho@gmail.com",
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
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({ 
            deposit: 500 
        })
    }
);

afterAll(
    async () => {
        await mongoose.connection.close()
        console.log('desconectou');
    }
);


describe('Test post withdraw', () => {
    it('post route withdraw', async () => {
        const res = await request(app).post('/withdraw')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({ 
            withDraw: 200 
        })
        
        expect(res.body).toHaveProperty("balance")
        expect(res.body).toHaveProperty("withdraw")
        expect(res.statusCode).toEqual(200)
    })

    it('post route error withdraw invalid', async () => {
        const res = await request(app).post('/withdraw')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({ 
            withDraw: 301 
        })
        
        expect(res.body).toHaveProperty("error", "Saldo insuficiente.")
        expect(res.statusCode).toEqual(400)
    })

    it('post route error withdraw not provide', async () => {
        const res = await request(app).post('/withdraw')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            withDraw: 0
        })
        
        expect(res.body).toHaveProperty("error", "O valor do saque é obrigatório e deve ser maior ou igual a R$1.")
        expect(res.statusCode).toEqual(400)
    })
})
