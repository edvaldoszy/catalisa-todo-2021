const jwt = require('./jwt');
const modelos = require('../modelos');

const Usuario = modelos.Usuario;

async function autenticacao(req, res, next) {
  const token = req.headers.token;
  const payload = jwt.validaToken(token);

  if (payload) {
    const usuario = await Usuario
      .where('id', payload.id)
      .fetch();
    
    if (usuario) {
      req.usuario = usuario.toJSON();
      next();
    } else {
      res.status(401).json({
        mensagem: 'Você não tem autorização para acessar esta página'
      });
    }
  } else {
    res.status(401).json({
      mensagem: 'Você não tem autorização para acessar esta página'
    });
  }
}

module.exports = autenticacao;