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
            cpf: 11111111101,
            email: "juoao@gmail.com",
            password: "123456",
            address: {
                street: "Jose Maria Carlos",
                quarter: "Tarcila do Amaral",
                number: 84
            },
            phone: 14999999999,
            admin: true
        })

        await request(app).post('/create')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            name: "Maria",
            cpf: 11101111011,
            email: "marial@gmail.com",
            password: "123456",
            address: {
                street: "Jose Maria Carlos",
                quarter: "Tarcila do Amaral",
                number: 84
            },
            phone: 14999999999,
            admin: false
        })

        const resLogin = await request(app).post('/login')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            email: "juoao@gmail.com",
            password: "123456"
        })
        token = resLogin.body.token

        const resLoginAdminFalse = await request(app).post('/login')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            email: "marial@gmail.com",
            password: "123456"
        })
        tokenFalse = resLoginAdminFalse.body.token
    }
);

afterAll(
    async () => {
        await mongoose.disconnect()
        console.log('desconectou');
    }
);


describe('Test get accounts list', () => {
    it('get route accounts list', async () => {
        const res = await request(app).get('/accounts/list')
        .set('Authorization', `Bearer ${token}`)
        
        expect(res.body).toHaveProperty("finalReturn")
        expect(res.statusCode).toEqual(200)
    })

    it('get route accounts list token admin false', async () => {  
        token = tokenFalse   
        const res = await request(app).get('/accounts/list')
        .set('Authorization', `Bearer ${token}`)
        
        expect(res.body).toHaveProperty("error", "Você não tem acesso a essa rota.")
        expect(res.statusCode).toEqual(400)
    })
})
