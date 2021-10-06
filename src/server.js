const express = require('express');
const routes = require('./routes/routes')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/apiFinanceira')

const app = express();
app.use(express.json());

app.use(routes);

app.listen(3333,() => {//?Eh a porta que está rodando no navegador
    console.log("Rodando")
});