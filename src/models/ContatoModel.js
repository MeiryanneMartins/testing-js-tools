const mongoose = require('mongoose');
const validator =  require('validator');

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  //se não tiver sobrenome por default envia uma string vazia
  sobrenome: {type: String, required: false, default: ''},
  email: {type: String, required: false, default: ''},
  telefone: {type: String, required: false, default: ''},
  criadoEM: {type: Date, default: Date.now},

});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato(body){
    this.body =  body;
    this.erros = [];
    this.contato = null;

}

//não atrelada ao prototype. Função estática (não precisa usar o this)
Contato.buscaPorId = async function(id){
    if(typeof id !== 'string') return;
    
    const user = await ContatoModel.findById(id);
    return user;
};

Contato.prototype.register = async function(){
    this.valida();
    if(this.erros.length > 0) return;

    //mandando o objeto já pronto
    this.contato = await ContatoModel.create(this.body);
};

Contato.prototype.valida = function(){
    this.cleanUp();

    //verificando e enviando com push os erros para o array de erros caso tenha
    if(this.body.email && !validator.isEmail(this.body.email)) this.erros.push('E-mail inválido!');
    if(!this.body.nome) this.erros.push('Nome é um campo obrigatório');
    if(!this.body.email && !this.body.telefone){
        this.erros.push('Pelo menos um email e telefone precisam ser cadastrados');
    }

}

// Se o corpo (campos do formulário) for diferente de uma string ele converte
Contato.prototype.cleanUp= function(){
    for(const key in this.body){
        if(typeof this.body[key] !== 'string'){
            this.body[key] = '';
       }
    }

    // Garante que só esses campos serão enviados
    this.body = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone,
    };

}


module.exports = Contato;
