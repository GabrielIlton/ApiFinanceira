const request = require('supertest');
const app = require('../src/app');  
const mongoose = require('mongoose');
const { mongoUri } = require('../globalConfig.json');


beforeAll(
    async () => {
        await mongoose.connect(mongoUri, { useNewUrlParser: true })
    }
);

describe('Test my app server', () => {
    it('post route create', async () => {        
        const res = await request(app).post('/create')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            name: "Jooaao",
            cpf: 12111111111,
            email: "jooaao@gmail.com",
            password: "123456",
            address: {
                street: "Jose Maria Carlos",
                quarter: "Tarcila do Amaral",
                number: 84
            },
            phone: 14999999999
        })

        expect(res.statusCode).toBe(201)
        expect(res.body).toHaveProperty('nome', 'Jooaao')
        expect(res.body).toHaveProperty('email', 'jooaao@gmail.com')
    })
    
    it('post route create again', async () => {        
        const res = await request(app).post('/create')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            name: "Jooaao",
            cpf: 12111111111,
            email: "jooaao@gmail.com",
            password: "123456",
            address: {
                street: "Jose Maria Carlos",
                quarter: "Tarcila do Amaral",
                number: 84
            },
            phone: 14999999999
        })

        expect(res.statusCode).toBe(422)
        expect(res.body).toHaveProperty('error', 'CPF ou email já existente.')
    })

    it('post route create email invalid', async () => {
        const res = await request(app).post('/create')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            name: "Jooaao",
            cpf: 11111111111,
            email: "jooaao.gmail.com",
            password: "123456",
            address: {
                street: "Jose Maria Carlos",
                quarter: "Tarcila do Amaral",
                number: 84
            },
            phone: 14999999999
        })

        expect(res.statusCode).toBe(422)
        expect(res.body).toHaveProperty('error', 'Email deve ter uma estrutura adequada, como por exemplo "karrlus@gmail.com".')
    })

    it('post route create not provide name', async () => {      
        const res = await request(app).post('/create')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            cpf: 11111111111,
            email: "jooao@gmail.com",
            password: "123456",
            address: {
                street: "Jose Maria Carlos",
                quarter: "Tarcila do Amaral",
                number: 84
            },
            phone: 14999999999
        })

        expect(res.statusCode).toBe(422)
        expect(res.body).toHaveProperty('error', 'Nome é obrigatório.')
    })

    it('post route create not provide CPF', async () => {       
        const res = await request(app).post('/create')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            name: "Jooaao",
            email: "jooao@gmail.com",
            password: "123456",
            address: {
                street: "Jose Maria Carlos",
                quarter: "Tarcila do Amaral",
                number: 84
            },
            phone: 14999999999
        })

        expect(res.statusCode).toBe(422)
        expect(res.body).toHaveProperty('error', 'CPF é obrigatório.')
    })

    it('post route create CPF invalid', async () => {      
        const res = await request(app).post('/create')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            name: "Jooaao",
            cpf: 1111111111,
            email: "jooao@gmail.com",
            password: "123456",
            address: {
                street: "Jose Maria Carlos",
                quarter: "Tarcila do Amaral",
                number: 84
            },
            phone: 14999999999
        })

        expect(res.statusCode).toBe(422)
        expect(res.body).toHaveProperty('error', 'CPF deve ser igual a 11 caracteres.')
    })
    
    it('post route create Adress not provide', async () => {       
        const res = await request(app).post('/create')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            name: "Jooaao",
            cpf: 11111111111,
            email: "jooaao@gmail.com",
            password: "123456",
            phone: 14999999999
        })

        expect(res.statusCode).toBe(422)
        expect(res.body).toHaveProperty('error', 'Endereco é obrigatório.')
    })

    it('post route create phone not provide', async () => {      
        const res = await request(app).post('/create')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            name: "Jooaao",
            cpf: 11111111111,
            email: "jooaao@gmail.com",
            password: "123456",
            address: {
                street: "Jose Maria Carlos",
                quarter: "Tarcila do Amaral",
                number: 84
            }
        })
        
        expect(res.statusCode).toBe(422)
        expect(res.body).toHaveProperty('error', 'Número de telefone é obrigatório juntamente com o DDD.')
    })

    it('post route create phone invalid', async () => {      
        const res = await request(app).post('/create')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            name: "Jooaao",
            cpf: 11111111111,
            email: "jooaao@gmail.com",
            password: "123456",
            address: {
                street: "Jose Maria Carlos",
                quarter: "Tarcila do Amaral",
                number: 84
            },
            phone: 1499999999
        })
        
        expect(res.statusCode).toBe(422)
        expect(res.body).toHaveProperty('error', 'A quantidade de números de telefone deve ser igual a 11.')
    })

    it('post route create email not provide', async () => {      
        const res = await request(app).post('/create')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            name: "Jooaao",
            cpf: 11111111111,
            password: "123456",
            address: {
                street: "Jose Maria Carlos",
                quarter: "Tarcila do Amaral",
                number: 84
            },
            phone: 14999999999
        })
        
        expect(res.statusCode).toBe(422)
        expect(res.body).toHaveProperty('error', 'Email é obrigatório.')
    })

    it('post route create password not provide', async () => {      
        const res = await request(app).post('/create')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            name: "Jooaao",
            cpf: 11111111111,
            email: "jooaao@gmail.com",
            address: {
                street: "Jose Maria Carlos",
                quarter: "Tarcila do Amaral",
                number: 84
            },
            phone: 14999999999
        })
        
        expect(res.statusCode).toBe(422)
        expect(res.body).toHaveProperty('error', 'Senha é obrigatória.')
    })

    it('post route create password invalid', async () => {      
        const res = await request(app).post('/create')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            name: "Jooaao",
            cpf: 11111111111,
            email: "jooaao@gmail.com",
            password: "12345",
            address: {
                street: "Jose Maria Carlos",
                quarter: "Tarcila do Amaral",
                number: 84
            },
            phone: 14999999999
        })
        
        expect(res.statusCode).toBe(422)
        expect(res.body).toHaveProperty('error', 'Senha deve conter 6 caracteres.')
    })

    it('post route create password invalid', async () => {      
        const res = await request(app).post('/create')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
            name: "Jooaao",
            cpf: 11111111111,
            email: "jooaao@gmail.com",
            password: "1234567",
            address: {
                street: "Jose Maria Carlos",
                quarter: "Tarcila do Amaral",
                number: 84
            },
            phone: 14999999999 
        })
        
        expect(res.statusCode).toBe(422)
        expect(res.body).toHaveProperty('error', 'Senha deve conter 6 caracteres.')
    })
})

afterAll(
    async () => {
        await mongoose.connection.close()
        console.log('desconectou');
    }
);
