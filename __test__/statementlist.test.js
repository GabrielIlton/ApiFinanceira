const request = require('supertest');
const app = require('../src/app');  
const mongoose = require('mongoose');
const { mongoUri } = require('../globalConfig.json');


const account = {
    name: "Tia",
    cpf: 96111111011,
    email: "tia@gmail.com",
    password: "123456",
    address: {
        street: "Jose Maria Carlos",
        quarter: "Tarcila do Amaral",
        number: 84
    },
    phone: 14999999999,
    admin: true
}

const accountAdminFalse = {
    name: "Isa",
    cpf: 96111411011,
    email: "isa@gmail.com",
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

        await request(app).post('/create')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send( accountAdminFalse )

        const resLoginFalse = await request(app).post('/login')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            email: accountAdminFalse.email,
            password: accountAdminFalse.password
        })
        tokenFalse = resLoginFalse.body.token
    }
);

afterAll(
    async () => {
        await mongoose.connection.close()
        console.log('desconectou');
    }
);


describe('Test statementList', () => {
    it('get route statementList not found', async () => {
        const res = await request(app).get('/statement/list')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        
        expect(res.body).toHaveProperty("error", "Não há de transações.")
        expect(res.statusCode).toBe(404)
    })

    it('get route statementList', async () => {
        await request(app).post('/deposit')
        .set('Accept', 'aplication/json')
        .expect('Content-Type', /json/)
        .set('Authorization', `Bearer ${token}`)
        .send({
            deposit: 100
        })
        const res = await request(app).get('/statement/list')
        .set('Authorization', `Bearer ${token}`)
        .query({
            startDate: "2021-11-03",
            endDate: "2022-11-04"
        })
        
        expect(res.body).toHaveProperty("finalReturn")
        expect(res.statusCode).toBe(200)
    })

    it('get route statementList not access', async () => {
        token = tokenFalse
        const res = await request(app).get('/statement/list')
        .set('Authorization', `Bearer ${token}`)
        
        expect(res.body).toHaveProperty("error", "Você não tem acesso.")
        expect(res.statusCode).toBe(404)
    })
})
