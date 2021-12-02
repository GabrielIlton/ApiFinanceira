const request = require('supertest');
const app = require('../src/app');  
const mongoose = require('mongoose');
const { mongoUri } = require('../globalConfig.json');


beforeAll(
    async () => {
        await mongoose.connect(mongoUri, { useNewUrlParser: true })

        await request(app).post('/create')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            name: "Joao",
            cpf: 13011711111,
            email: "joaol@gmail.com",
            password: "123456",
            address: {
                street: "Jose Maria Carlos",
                quarter: "Tarcila do Amaral",
                number: 84
            },
            phone: 14999999999
        })
    }
);

afterAll(
    async () => {
        await mongoose.connection.close()
        console.log('desconectou');
    }
);

describe('Test login', () => {
    it('post route login', async () => {
        const res = await request(app).post('/login')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            email: "joaol@gmail.com",
            password: "123456"
        })
        expect(res.body).toHaveProperty('name')
        expect(res.body).toHaveProperty('token')
        expect(res.statusCode).toEqual(200)
    })

    it('post route login email incorrect', async () => {
        const res = await request(app).post('/login')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            email: "joaossa@gmail.com",
            password: "123456"
        })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('error', 'Conta não existe.')
    })

    it('post route login password incorrect', async () => {
        const res = await request(app).post('/login')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            email: "joaol@gmail.com",
            password: "654321"
        })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('error', 'Senha incorreta.')
    })

    it('not be provide email', async () => {
        const res = await request(app).post('/login')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            password: "654321"
        })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('error', 'Email é obrigatório.')
    })

    it('not be provide password', async () => {
        const res = await request(app).post('/login')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            email: "joaol@gmail.com",
        })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('error', 'Senha é obrigatória.')
    })
})
