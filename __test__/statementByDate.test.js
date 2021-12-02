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

        await request(app).post('/deposit')
        .set('Accept', 'aplication/json')
        .expect('Content-Type', /json/)
        .set('Authorization', `Bearer ${token}`)
        .send({
            deposit: 100
        })
    }
);

afterAll(
    async () => {
        await mongoose.connection.close()
        console.log('desconectou');
    }
);


describe('Test statementByDate', () => {
    it('get route statementByDate', async () => {
        const res = await request(app).get('/statement/bydate')
        .set('Authorization', `Bearer ${token}`)
        .query({
            startDate: "2021-11-03",
            endDate: "2022-11-04"
        })
        
        expect(res.body).toHaveProperty("finalReturn")
        expect(res.statusCode).toBe(200)
    })

    it('get route statementByDate nothing transaction in date', async () => {
        const res = await request(app).get('/statement/bydate')
        .set('Authorization', `Bearer ${token}`)
        .query({
            startDate: "2021-11-03",
            endDate: "2021-11-04"
        })
        
        expect(res.body).toHaveProperty("error", "Não há nenhuma transação nesse período de tempo.")
        expect(res.statusCode).toBe(404)
    })

    it('get route statementByDate undefined', async () => {
        const res = await request(app).get('/statement/bydate')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        
        expect(res.body).toHaveProperty("error", "É preciso ter as data de início e de fim para a pesquisa.")
        expect(res.statusCode).toBe(404)
    })

    it('get route statementByDate startDate undefined', async () => {
        const res = await request(app).get('/statement/bydate')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .query({
            endDate: "2021-11-04"
        })
        
        expect(res.body).toHaveProperty("error", "Data de início da pesquisa é obrigatória.")
        expect(res.statusCode).toBe(404)
    })

    it('get route statementByDate endDate undefined', async () => {
        const res = await request(app).get('/statement/bydate')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .query({
            startDate: "2021-11-03"
        })
        
        expect(res.body).toHaveProperty("error", "Data final da pesquisa é obrigatória.")
        expect(res.statusCode).toBe(404)
    })
})
