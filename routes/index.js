var express = require('express');
var router = express.Router();
const modelos = require('../modelos');
const autenticacao = require('../helpers/autenticacao');
const Joi = require('joi');

router.get('/', autenticacao, async function(req, res, next) {
  // SELECT * FROM terefas WHERE usuario_id = ?
  const retorno = await modelos.Tarefa
    .where('usuario_id', '=', req.usuario.get('id'))
    .fetchAll();
  res.json(retorno);
});

function validacaoCadastro(req, res, next) {
  const schema = Joi.object({
    titulo: Joi.string().min(1).max(300).required(),
    concluida: Joi.boolean().required(),
  });
  const resultado = schema.validate(req.body);
  if (resultado.error) {
    res.status(400).json(resultado.error);
  } else {
    next();
  }
}

router.post('/', validacaoCadastro, autenticacao, async function(req, res, next) {
  const tarefa = new modelos.Tarefa({
    titulo: req.body.titulo,
    concluida: req.body.concluida,
    data_criacao: new Date(),
    usuario_id: req.usuario.get('id'),
  });

  const retorno = await tarefa.save();
  res.status(201).json(retorno);
});

module.exports = router;
