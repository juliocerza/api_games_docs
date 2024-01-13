# API de Games

Esta API é utilizada para listar jogos

## EndPoints

### GET /games

Este endpoint é responsável pela listagem de todos os jogos cadastrados no banco de dados

#### Parâmetros

Nenhum

#### Respostas

##### Ok! 200

Caso ocorra essa resposta, você receberá a listagem de todos os jogos

##### Falha na autenticação! 401

Caso ocorra essa resposta, significa que houve alguma falha no processo de autenticação da requisição. Motivos: Token inválido, Token expirado.
