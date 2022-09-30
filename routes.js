const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contatoController');

//para certificar que só acesse a pag se estiver logado.
const {loginRequired} =  require('./src/middlewares/middleware');

// Rotas da home
route.get('/', homeController.index);

// Rotas de Login
route.get('/login/index', loginController.index);
route.post('/login/register', loginController.register);
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logout);

//Rotas contato

//adiciona o parâmetro loginRequired para somente logados acessar a pag 
route.get('/contato/index', loginRequired, contatoController.index);
route.post('/contato/register', loginRequired,contatoController.register);
//O :id é um parâmentro de URL
route.get('/contato/index/:id', loginRequired, contatoController.editIndex );
route.post('/contato/edit/:id', loginRequired,contatoController.edit);
route.get('/contato/delete/:id', loginRequired, contatoController.delete);

module.exports = route;
