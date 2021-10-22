var express = require('express');
var router = express.Router();
const Joi = require('joi');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

function validacao(request, response, next) {
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

router.post('/', validacao, function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
