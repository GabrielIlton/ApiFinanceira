const express = require('express');
const app = express();
const routes = require('./routes/routes');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/apiFinanceira');
const swaggerUi = require('swagger-ui-express'); 
const swaggerDocs = require('../swagger.json')
// const swaggerJsDoc = require('swagger-jsdoc');


app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(routes);
 
app.listen(3333,() => {//?Eh a porta que está rodando no navegador
    console.log("Rodando")
});