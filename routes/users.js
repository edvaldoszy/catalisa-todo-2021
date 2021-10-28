var express = require('express');
var router = express.Router();
const Joi = require('joi');
const modelos = require('../modelos');
const criptografia = require('../helpers/criptografia');
const jwt = require('../helpers/jwt');
const autenticacao = require('../helpers/autenticacao');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

function validacaoCadastro(request, response, next) {
  const schema = Joi.object({
    nome: Joi.string().min(1).max(200).required(),
    email: Joi.string().min(1).max(200).required(),
    senha: Joi.string().min(6).max(80).required(),
  });
  const resultado = schema.validate(request.body);
  if (resultado.error) {
    response.status(400).json(resultado.error);
  } else {
    next();
  }
}

router.post('/', validacaoCadastro, async function(req, res, next) {
  // SELECT * FROM usuarios WHERE email = 'edvaldoszy@gmail.com'
  const usuarioExistente = await modelos.Usuario
    .where('email', '=', req.body.email)
    .fetch();
  if (usuarioExistente) {
    res.status(400).json({
      mensagem: 'O endereço de e-mail já está cadastrado'
    });
    return;
  }
  
  const usuario = new modelos.Usuario({
    nome: req.body.nome,
    email: req.body.email,
    senha: criptografia.geraHash(req.body.senha),
  });

  const retorno = await usuario.save();
  res.status(201).json(retorno);
});

function validaLogin(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().min(1).max(200).required(),
    senha: Joi.string().min(6).max(80).required(),
  });
  const resultado = schema.validate(req.body);
  if (resultado.error) {
    res.status(400).json(resultado.error);
  } else {
    next();
  }
}

router.post('/login', validaLogin, async function (req, res) {
  const usuarioExistente = await modelos.Usuario
    .where('email', '=', req.body.email)
    .fetch();
  
  if (usuarioExistente) {
    const senhaEstaCorreta = criptografia.comparaHash(req.body.senha, usuarioExistente.get('senha'))
    if (senhaEstaCorreta) {
      const token = jwt.geraToken(usuarioExistente);
      res.json({
        token: token,
        usuario: usuarioExistente,
      });
    } else {
      res.status(400).json({
        mensagem: 'As credenciais são inválidas',
      });
    }
    // res.json(usuarioExistente);
    // return;
  } else {
    res.status(400).json({
      mensagem: 'As credenciais são inválidas',
    });
  }
});

module.exports = router;
