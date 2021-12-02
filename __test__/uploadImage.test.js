const request = require('supertest');
const app = require('../src/app');  
const mongoose = require('mongoose');
const { mongoUri } = require('../globalConfig.json');


const account = {
    name: "Joaoa",
    cpf: 11178911111,
    email: "joaoa@gmail.com",
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


describe('Test upload image', () => {
    it('post route image null', async () => {
        const res = await request(app).post('/image')
        .set('Authorization', `Bearer ${token}`)
        
        expect(res.body).toHaveProperty("error", "Imagem é obrigatória.")
        expect(res.statusCode).toBe(400)
    })
    
    it('post route image', async () => {
        const res = await request(app).post('/image')
        .set('Authorization', `Bearer ${token}`)
        .field('file', 'image')
        .attach('file', '__test__/files/image.jpg')
        
        expect(res.statusCode).toBe(200)
    })
    
    it('post route image again', async () => {
        const res = await request(app).post('/image')
        .set('Authorization', `Bearer ${token}`)
        .field('file', 'image')
        .attach('file', '__test__/files/image.jpg')
        
        expect(res.body).toHaveProperty("error", "Só é possível ter uma imagem.")
        expect(res.statusCode).toBe(400)
    })
})
