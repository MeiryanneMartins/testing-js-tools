const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');

function meuMiddleware(req, res, next){
    console.log();
    console.log("passei no middleware");
    console.log();
    next();
}

route.get('/', meuMiddleware ,homeController.paginaInicial);
route.post('/', homeController.trataPost);

module.exports = route;