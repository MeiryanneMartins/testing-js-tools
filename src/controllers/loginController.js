const Login = require('../models/LoginModel')

exports.index = (req, res) => {
    //req.session.user é responsável por verificar se o usuário está logado
    if(req.session.user) return res.render('login-logado');
    res.render('login');

};

exports.register = async function(req, res){

    try {
        const login = new Login(req.body);
        await login.register();
        
       // tenta registrar o usuário se não der ele volta pra página
        if(login.erros.length < 0){
            req.flash('erros', login.erros);
            
            req.session.save(function(){
              return res.redirect('back');
            });  
            
            return;
        }

        req.flash('success', 'Seu usuário foi criado com sucesso.');
        req.session.save(function() {
          return res.redirect('back');
        });
        
        res.send(login.erros);
        
    } catch (e) {
        console.log(e);
        return res.render('404');
    }

};

exports.login = async function(req, res){

    try {
        const login = new Login(req.body);
        await login.login();
        
       // tenta registrar o usuário se não der ele volta pra página
        if(login.erros.length < 0){
            req.flash('erros', login.erros);
            
            req.session.save(function(){
              return res.redirect('back');
            });  
            
            return;
        }

        req.flash('success', 'Você entrou no sistema.');

        //session para identificar a sessão do usuário
        req.session.user = login.user;
        req.session.save(function() {
          return res.redirect('back');
        });
        
        res.send(login.erros);
        
    } catch (e) {
        console.log(e);
        return res.render('404');
    }

};

exports.logout = function(req, res){
    req.session.destroy();
    res.redirect('/')
};