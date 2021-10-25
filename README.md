https://gitlab.com/edvaldoszy/catalisa-todo

## Rota de cadastro de usuários

- Validar se o corpo da requisição contém:
  - nome do tipo texto com o máximo de 200 caracteres
  - email do tipo texto com o máximo de 200 caracteres
  - senha do tipo texto com o mínimo de 6 e máximo de 80

- Validar se um usuário com o mesmo e-mail já existe na base de dados
- Criptografar a senha antes de salvar no banco
- Retorna o usuário cadastrado na resposta


## Rota de autenticação do usuário

- Validar se o corpo da requisição contém:
  - email do tipo texto com o máximo de 200 caracteres e se e um e-mail válido
  - senha do tipo texto com o mínimo de 6 e máximo de 80

- Validar se o usuário existe no banco e a senha é válida
- Gerar o token de acesso e retornar na resposta
