# StockNexus 

Sistema de gerenciamento de estoque desenvolvido com JavaScript, Node.js, Express e SQLite.

O projeto permite cadastrar, visualizar, pesquisar, editar e remover produtos através de uma interface moderna e dinâmica.

---

# Funcionalidades

* Cadastro de produtos
* Listagem dinâmica
* Pesquisa em tempo real
* Edição de produtos
* Exclusão com confirmação
* Dashboard com métricas
* Alerta de estoque baixo
* API REST com Express
* Banco de dados SQLite

---

# Tecnologias

## Frontend

* HTML
* CSS
* JavaScript

## Backend

* Node.js
* Express.js

## Banco de Dados

* SQLite3

---

# Como executar

## Instalar dependências

```bash id="f3a5w1"
npm install
```

## Iniciar servidor

```bash id="m9k2x4"
npx nodemon server.js
```

ou

```bash id="d7q8v2"
node server.js
```

---

# API

```http id="h2m6x8"
GET    /produtos
POST   /produtos
PUT    /produtos/:id
DELETE /produtos/:id
```

---

# Autor

Matheus Victor 🚀
