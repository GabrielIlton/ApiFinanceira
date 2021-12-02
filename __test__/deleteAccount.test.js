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
            name: "Jose",
            cpf: 11141111111,
            email: "joses@gmail.com",
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
            cpf: 12111111011,
            email: "marias@gmail.com",
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
            email: "joses@gmail.com",
            password: "123456"
        })
        token = resLogin.body.token

        const resLoginAdminFalse = await request(app).post('/login')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            email: "marias@gmail.com",
            password: "123456"
        })
        tokenFalse = resLoginAdminFalse.body.token

    }
);

afterAll(
    async () => {
        await mongoose.connection.close()
        console.log('desconectou');
    }
);


describe('Test delete account', () => {
    it('delete route account admin true', async () => {
        const res = await request(app).delete('/delete')
        .set('Authorization', `Bearer ${token}`)
        .send({
            cpf: 11141111111
        })
            
        expect(res.body).toHaveProperty("message", "Deletado com sucesso.")
        expect(res.statusCode).toBe(200)
    })

    it('delete route admin again', async () => {
        const res = await request(app).delete('/delete')
        .set('Authorization', `Bearer ${token}`)
        .send({
            cpf: 11141111111
        })
        
        expect(res.body).toHaveProperty("error", "Conta já deletada.")
        expect(res.statusCode).toBe(400)
    })
    
    it('delete route account with cpf undefined', async () => {
        const res = await request(app).delete('/delete')
        .set('Authorization', `Bearer ${token}`)
            
        expect(res.body).toHaveProperty("error", "Passe um CPF para deleção da conta.")
        expect(res.statusCode).toBe(400)
    })

    it('delete route account admin false', async () => {
        token = tokenFalse
        const res = await request(app).delete('/delete')
        .set('Authorization', `Bearer ${token}`)
        
        expect(res.body).toHaveProperty("message", "Deletado com sucesso.")
        expect(res.statusCode).toBe(200)
    })

    it('delete account deleted true admin false', async () => {
        token = tokenFalse
        const res = await request(app).delete('/delete')
        .set('Authorization', `Bearer ${token}`)
        .send({
            cpf: 12111111011
        })
        
        expect(res.body).toHaveProperty("error", "Você não tem acesso para deletar contas.")
        expect(res.statusCode).toBe(400)
    })
})
