var express = require('express');
var router = express.Router();
const modelos = require('../modelos');
const autenticacao = require('../helpers/autenticacao');
const Joi = require('joi');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

function validacaoCadastro(request, response, next) {
  const schema = Joi.object({
    titulo: Joi.string().min(1).max(300).required(),
    concluida: Joi.boolean().required(),
  });
  const resultado = schema.validate(request.body);
  if (resultado.error) {
    response.status(400).json(resultado.error);
  } else {
    next();
  }
}

router.post('/', validacaoCadastro, autenticacao, async function(req, res, next) {
  const tarefa = new modelos.Tarefa({
    titulo: req.body.titulo,
    concluida: req.body.concluida,
    data_criacao: new Date(),
    usuario_id: req.usuario.get('id')
  });

  const retorno = await tarefa.save();
  res.status(201).json(retorno);
});

module.exports = router;
