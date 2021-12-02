const request = require('supertest');
const app = require('../src/app');  
const mongoose = require('mongoose');
const { mongoUri } = require('../globalConfig.json');


const account = {
    name: "Joaoao",
    cpf: 10111891111,
    email: "joaoao@gmail.com",
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

        await request(app).post('/image')
        .set('Authorization', `Bearer ${token}`)
        .field('file', 'image')
        .attach('file', '__test__/files/image.jpg')
    }
);

afterAll(
    async () => {
        await mongoose.connection.close()
        console.log('desconectou');
    }
);


describe('Test delete image', () => {
    it('delete route image', async () => {
        const res = await request(app).delete('/image')
        .set('Authorization', `Bearer ${token}`)
        
        expect(res.body).toHaveProperty('message', 'Sua imagem foi deletada com sucesso.')
        expect(res.statusCode).toBe(200)
    })

    it('delete route image again', async () => {
        const res = await request(app).delete('/image')
        .set('Authorization', `Bearer ${token}`)
        
        expect(res.body).toHaveProperty('error', 'Imagem não existe.')
        expect(res.statusCode).toBe(400)
    })
})
