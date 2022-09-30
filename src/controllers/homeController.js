const { async } = require('regenerator-runtime');
const Contato = require('../models/ContatoModel');

exports.index = async (req, res) => {
  const contatos = await Contato.buscaContatos();

  //injetando esses contatos lá no meu template index.js
  res.render('index', {contatos})
  return;
};

