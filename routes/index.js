const express = require('express');
const router = express.Router();
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

function validacaoAlteracao(req, res, next) {
  const schema = Joi.object({
    titulo: Joi.string().min(1).max(300),
    concluida: Joi.boolean(),
  });
  const resultado = schema.validate(req.body);
  if (resultado.error) {
    res.status(400).json(resultado.error);
  } else {
    next();
  }
}

router.put('/:id', validacaoAlteracao, autenticacao, async function (req, res, next) {
  // SELECT * FROM tarefas WHERE id = 3 AND usuario_id = 12
  const tarefaExistente = await modelos.Tarefa
    .where('id', '=', req.params.id)
    .where('usuario_id', '=', req.usuario.get('id'))
    .fetch();
  if (!tarefaExistente) {
    res.status(400).json({
      mensagem: 'A tarefa não existe'
    });
    return;
  }

  // UPDATE tarefas SET titulo = 'Novo titulo da tarefas'
  tarefaExistente.set('titulo', req.body.titulo);
  tarefaExistente.set('concluida', req.body.concluida);
  const retorno = await tarefaExistente.save();
  res.json(retorno);
});

router.delete('/:id', autenticacao, async function (req, res, next) {
  // SELECT * FROM tarefas WHERE id = 3 AND usuario_id = 12
  const tarefaExistente = await modelos.Tarefa
    .where('id', '=', req.params.id)
    .where('usuario_id', '=', req.usuario.get('id'))
    .fetch();
  if (!tarefaExistente) {
    res.status(400).json({
      mensagem: 'A tarefa não existe'
    });
    return;
  }

  await tarefaExistente.destroy();
  res.json(tarefaExistente);
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
