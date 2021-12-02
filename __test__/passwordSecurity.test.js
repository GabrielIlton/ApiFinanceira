const request = require('supertest');
const app = require('../src/app');  
const mongoose = require('mongoose');
const { mongoUri } = require('../globalConfig.json');


const account = {
    name: "Joao",
    cpf: 11111113111,
    email: "joaaos@gmail.com",
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
        await request(app).delete('/delete')
        .set('Authorization', `Bearer ${token}`)
        
        await mongoose.connection.close()
        console.log('desconectou');
    }
);


describe('Test post passwordsecurity', () => {
    it('post route password/security', async () => {
        const res = await request(app).post('/password/security')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({ 
            passwordSecurity: "101010" 
        })
        
        expect(res.body).toHaveProperty("message", "Sucesso ao criar senha de segurança.")
        expect(res.statusCode).toEqual(200)
    })

    it('post route error password/security to been provide', async () => {
        const res = await request(app).post('/password/security')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({ 
            passwordSecurity: "101010" 
        })
        
        expect(res.body).toHaveProperty("error", "Você já possui uma senha de segurança.")
        expect(res.statusCode).toEqual(400)
    })

    it('post route error not provide password/security', async () => {
        const res = await request(app).post('/password/security')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        
        expect(res.body).toHaveProperty("error", "Senha de segurança é obrigatória.")
        expect(res.statusCode).toEqual(400)
    })

    it('post route error provide password/security invalid', async () => {
        const res = await request(app).post('/password/security')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({ 
            passwordSecurity: "10101" 
        })
        
        expect(res.body).toHaveProperty("error", "Senha deve conter 6 caracteres.")
        expect(res.statusCode).toEqual(400)
    })
})
