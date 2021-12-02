const request = require('supertest');
const app = require('../src/app');  
const mongoose = require('mongoose');
const { mongoUri } = require('../globalConfig.json');


const account = {
    name: "Pedro",
    cpf: 13610113181,
    email: "pedro@gmail.com",
    password: "123456",
    address: {
        street: "Jose Maria Carlos",
        quarter: "Tarcila do Amaral",
        number: 84
    },
    phone: 14999999999
}

const accountReciever = {
    name: "luiz",
    cpf: 13610713181,
    email: "luiz@gmail.com",
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
        .send( accountReciever )

        await request(app).post('/deposit')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({ 
            deposit: 500 
        })
    }
);

afterAll(
    async () => {
        await mongoose.connection.close()
        console.log('desconectou');
    }
);


describe('Test post p2p', () => {
    it('post route p2p', async () => {
        const res = await request(app).post('/p2p')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({ 
            cpfReciever: 13610713181,
            amount: 100
        })
        
        expect(res.body).toHaveProperty("accountSend")
        expect(res.body).toHaveProperty("cashout")
        expect(res.body).toHaveProperty("balance")
        expect(res.body).toHaveProperty("accountReciever")
        expect(res.body).toHaveProperty("cashin")
        expect(res.body).toHaveProperty("response")
        expect(res.statusCode).toEqual(200)
    })

    it('post route error p2p cpf invalid', async () => {
        const res = await request(app).post('/p2p')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({ 
            cpfReciever: 13619713181,
            amount: 100
        })
        
        expect(res.body).toHaveProperty("error", "Conta de destinatário não existe")
        expect(res.statusCode).toEqual(400)
    })

    it('post route error p2p balance insuficient', async () => {
        const res = await request(app).post('/p2p')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            cpfReciever: 13610713181,
            amount: 1000
        })
        
        expect(res.body).toHaveProperty("error", "Não tem saldo suficiente para a transação.")
        expect(res.statusCode).toEqual(400)
    })

    it('post route error p2p balance insuficient', async () => {
        const res = await request(app).post('/p2p')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            cpfReciever: 13610113181,
            amount: 100
        })
        
        expect(res.body).toHaveProperty("error", "Não pode fazer a transferência para si mesmo.")
        expect(res.statusCode).toEqual(400)
    })

    it('post route error p2p cpf undefined', async () => {
        const res = await request(app).post('/p2p')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            amount: 1000
        })
        
        expect(res.body).toHaveProperty("error", "CPF do recebedor é obrigatório.")
        expect(res.statusCode).toEqual(400)
    })

    it('post route error p2p amount undefined', async () => {
        const res = await request(app).post('/p2p')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            cpfReciever: 13610113181
        })
        
        expect(res.body).toHaveProperty("error", "O valor da transferência é obrigatório.")
        expect(res.statusCode).toEqual(400)
    })
})
