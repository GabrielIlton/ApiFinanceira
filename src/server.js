require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
const express = require('express');
const routes = require('./routes/routes');
const swaggerUi = require('swagger-ui-express'); 
const swaggerDocs = require('../swagger.json')
const morgan = require('morgan');
const path = require('path');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/image', express.static(path.resolve(__dirname, "..", "tmp")));
app.use(routes);

app.listen(3333,() => {
    console.log("Rodando")
});

// -GET: Leitura
// -POST: Criação
// -PULL: Atualização
// -DELETE: Deleção
// -PATCH: Atualização parcial

// -1XX: Informação 
// -2XX: Confirmação
//     °200 - Requisição bem sucedidda
//     °201 - Created - Geralmente usado para POST após uma inserção

// -3XX: Redirecionamento
//     °301 - Moved Permanently
//     °302 - Moved

// -4XX: Error do client
//     °400 - Bad request
//     °401 - Unauthorized
//     °403 - Forbidden
//     °404 - Not Found
//     °422 - Unprocessable Entity

// -5XX: Error no Server
//     °500 - Internal Server Error
//     °502 - Bad Gateway

// //todo: splice altera o conteudo, add conteudo novo e remove o velho