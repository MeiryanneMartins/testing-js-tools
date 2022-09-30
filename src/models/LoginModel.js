const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

//está criando esses dados lá no mongo em uma tabela
const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: {type: String, required: true}
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body){
        this.body = body;
        this.erros = [];
        this.user = null;
    }

    async login() {
        this.valida();
        if(this.erros.length > 0 ) return;
    }

    async register(){
        this.valida();

        //Se meu array de erros não estiver vazio (ou seja se tiver dado push nos erros - tem erros)
        if(this.erros.length > 0) return;

        await this.userExists();

        if(this.erros.length > 0) return;

        //instalado pacote bcryptjs aqui ele está fazendo o hash da senha (criptografando)
        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);

        //aqui ele cria um objeto com o corpo da requisão que são aqueles dados de usuário e senha
        this.user = await LoginModel.create(this.body);
        
    }

    async userExists(){

        //encontrando um registro na base de dados igual o email que está sendo enviado
        //retornando ou um usuário ou Null
       const user = await LoginModel.findOne({email: this.body.email});

       //checando se o usuário já existe. Se sim, ele da um push para o array de erros e manda pro usuário
       if(user) this.erros.push('Usuário já existe')
    }

    valida(){
        this.cleanUp();

        //verificando e enviando com push os erros para o array de erros caso tenha
        if(!validator.isEmail(this.body.email)) this.erros.push('E-mail inválido!');

        if(this.body.password.length < 3 || this.body.password > 50) {
            this.erros.push('A senha precisa estar entre 3 e 50 caracteres!');
        }

    }

    // Se o corpo (campos do formulário) for diferente de uma string ele converte
    cleanUp(){
        for(const key in this.body){
            if(typeof this.body[key] !== 'string'){
                this.body[key] = '';
           }
        }

        // Garante que só esses campos serão enviados
        this.body = {
            email: this.body.email,
            password: this.body.password
        };

    }

}

module.exports = Login;
