const request = require('supertest');
const app = require('../src/app');  
const mongoose = require('mongoose');
const { mongoUri } = require('../globalConfig.json');


const account = {
    name: "Joao da Silva",
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
        await mongoose.connection.close()
        console.log('desconectou');
    }
);

describe('Test midddleware', () => {
    it('get route details token not be provide', async () => {
        const res = await request(app).get('/details')
        
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty("error", "Token indefinido.")
    })

    it('get route balance token not be provide', async () => {
        const res = await request(app).get('/balance')
        
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty("error", "Token indefinido.")
    })

    it('get route accounts/list token not be provide', async () => {
        const res = await request(app).get('/accounts/list')
        
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty("error", "Token indefinido.")
    })

    it('post route password/security token not be provide', async () => {
        const res = await request(app).post('/password/security')
        
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty("error", "Token indefinido.")
    })

    it('put route password token not be provide', async () => {
        const res = await request(app).put('/password')
        
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty("error", "Token indefinido.")
    })

    it('post route image token not be provide', async () => {
        const res = await request(app).post('/image')
        
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty("error", "Token indefinido.")
    })

    it('delete route image token not be provide', async () => {
        const res = await request(app).delete('/image')
        
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty("error", "Token indefinido.")
    })

    it('delete route delete token not be provide', async () => {
        const res = await request(app).delete('/delete')
        
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty("error", "Token indefinido.")
    })

    it('get route statement token not be provide', async () => {
        const res = await request(app).get('/statement')
        
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty("error", "Token indefinido.")
    })

    it('get route statementByDate token not be provide', async () => {
        const res = await request(app).get('/statement/bydate')
        
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty("error", "Token indefinido.")
    })

    it('get route statement/list token not be provide', async () => {
        const res = await request(app).get('/statement/list')
        
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty("error", "Token indefinido.")
    })

    it('post route deposit token not be provide', async () => {
        const res = await request(app).post('/deposit')
        
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty("error", "Token indefinido.")
    })

    it('post route withdraw token not be provide', async () => {
        const res = await request(app).post('/withdraw')
        
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty("error", "Token indefinido.")
    })

    it('post route p2p token not be provide', async () => {
        const res = await request(app).post('/p2p')
        
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty("error", "Token indefinido.")
    })
})
