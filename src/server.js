const express = require('express');
const app = express();
const routes = require('./routes/routes');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/apiFinanceira');
const swaggerUi = require('swagger-ui-express'); 
const swaggerDocs = require('../swagger.json')
// const swaggerJsDoc = require('swagger-jsdoc');


app.use(express.json());
// const swaggerOptions = {
//     swaggerDefinition: {
//         info: {
//             title: 'API Financeira',
//             description: "System Bank Service",
//             contact: {
//                 name: "Joy"
//             },
//             servers: ["http://localhost:3333"]
//         }
//     },
//     //['.routes/*.js]
//     apis: ["server.js"]
// };

// const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// app.use(routes);

// /**
//  * @swagger
//  * /accounts:
//  *  get:
//  *      description: Create account 
//  *      responses:
//  *          '200':
//  *          description: Sucessfull response
//  */ 
app.get('/accounts', (req, res) => {
    res.status(200).send("Sucessfull");
});

app.listen(3333,() => {//?Eh a porta que está rodando no navegador
    console.log("Rodando")
});