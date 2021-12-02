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
        })

        const resLogin = await request(app).post('/login')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            email: "joao@gmail.com",
            password: "123456"
        })
        token = resLogin.body.token

        await request(app).delete('/delete')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .set('Authorization', `Bearer ${token}`)
        .send({
            cpf: 11111111111
        })
    }
)

afterAll(
    async () => {
        await mongoose.connection.close()
        console.log('desconectou');
    }
)


describe('Test retrieve account', () => {
    it('put route retrieve account', async () => {
        const res = await request(app).put('/retrieve')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            cpf: 11111111111
        })    
        
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("message", "Conta recuperada com sucesso.")
        expect(res.statusCode).toBe(200)
    })
    
    it('put route retrieve account already exists', async () => {
        const res = await request(app).put('/retrieve')
        
        expect(res.body).toHaveProperty("error", "CPF é obrigatório.")
        expect(res.statusCode).toBe(400)
    })

    it('put route retrieve account already exists', async () => {
        const res = await request(app).put('/retrieve')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            cpf: 11111111111
        }) 
        
        expect(res.body).toHaveProperty("error", "Conta já existe.")
        expect(res.statusCode).toBe(400)
    })

    it('put route retrieve account not exists', async () => {
        const res = await request(app).put('/retrieve')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            cpf: 11111181111
        }) 
        
        expect(res.body).toHaveProperty("error", "Conta não existe.")
        expect(res.statusCode).toBe(400)
    })
})
