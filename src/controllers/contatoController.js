const { async } = require('regenerator-runtime');
const Contato = require('../models/ContatoModel');

exports.index = (req, res) => {
  res.render('contato', {
    contato: {}
  });
};

exports.register = async(req, res) => {
    
    const contato = new Contato(req.body);
    await contato.register();

    if(contato.erros.length > 0) {
      req.flash('erros', contato.erros);
      req.session.save(() => res.redirect('back'));
      return;
    }

    req.flash('success', 'Contato registrado com sucesso.');
    req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
    return;
};

exports.editIndex = async function(req, res){
    //se não for enviado o parâmetro id ele retorna 404
    if(!req.params.id) return res.render('404');

    const contato = await Contato.buscaPorId(req.params.id);
    if(!contato) return res.render('404');
    res.render('contato', {contato});

};

exports.edit = async function(req, res){
    if(!req.params.id) return res.render('404');
    const contato = new Contato(req.body);
    await contato.edit(req.params.id);

    if(contato.erros.length > 0) {
        req.flash('erros', contato.erros);
        req.session.save(() => res.redirect('back'));
        return;
      }
  
      req.flash('success', 'Contato editado com sucesso.');
      req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
      return;
};

//precisa ser async toda vez que for mexer na base de dados

exports.delete =  async function(req, res){
  if(!req.params.id) return res.render('404');

  const contato = await Contato.delete(req.params.id);
  if(!contato) return res.render('404');

  req.flash('sucess', 'Contato apagado com sucesso.');
  req.session.save(() => res.redirect('back'));
  return;

};

