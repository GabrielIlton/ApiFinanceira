require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
const express = require('express');
const routes = require('./routes/routes');
const swaggerUi = require('swagger-ui-express'); 
const swaggerDocs = require('../swagger.json');
const path = require('path');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/image', express.static(path.resolve(__dirname, "..", "tmp")));
app.use(routes);

module.exports = app;