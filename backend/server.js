//importando as dependências necessárias
const express = require("express");//framework para criar o servidor
const cors = require("cors");
const db = require("./database");//importa o banco do database.js
//biblioteca que cria o servidor
const app = express();

app.use(cors());//permite front conversar com back
app.use(express.json());//permite receber JSON


// LISTAR PRODUTOS
//responde a requisição GET para /produtos
app.get("/produtos", (req, res) => {

    db.all("SELECT * FROM produtos", [], (err, rows) => {//busca no banco

        if (err) {
            return res.status(500).json({
                erro: err.message
            });
        }
        //retorna os produtos encontrados em formato JSON
        res.json(rows);
    });
});


// CADASTRAR PRODUTO
app.post("/produtos", (req, res) => {
    //pega os dados
    const {codigo_barras, nome, descricao, quantidade, preco } = req.body;

    db.run(//salvando no banco
        `
        INSERT INTO produtos
        (codigo_barras, nome, descricao, quantidade, preco)
        VALUES (?, ?, ?, ?, ?)
        `,//???? são os placeholders, os espaços la no banco
        //e sao substituidos pelos valores do array abaixo
        [codigo_barras, nome, descricao, quantidade, preco],

        function(err) {

            if (err) {//se der erro mostra mensagem
                return res.status(500).json({
                    erro: err.message
                });
            }
            //se receber json do banco, mostra mensagem de sucesso e o id do produto cadastrado
            res.json({
                mensagem: "Produto cadastrado!",
                id: this.lastID
            });
        }
    );
});

//DELETAR
app.delete("/produtos/:id", (req, res) => {
    const id = req.params.id;//pega o id do produto a ser deletado
    db.run("DELETE FROM produtos WHERE id = ?", [id], function(err) {
        if (err) {
            return res.status(500).json({   
                erro: err.message
            });
        }
        res.json({
            mensagem: "Produto deletado!"
        });
    });
});

// EDITAR PRODUTO
app.put("/produtos/:id", (req, res) => {

    const id = req.params.id;

    const {
        codigo_barras,
        nome,
        descricao,
        quantidade,
        preco
    } = req.body;

    db.run(
        `
        UPDATE produtos
        SET
            codigo_barras = ?,
            nome = ?,
            descricao = ?,
            quantidade = ?,
            preco = ?
        WHERE id = ?
        `,
        [
            codigo_barras,
            nome,
            descricao,
            quantidade,
            preco,
            id
        ],

        function(err) {

            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            res.json({
                mensagem: "Produto atualizado!"
            });
        }
    );
});

//liga p servidor na porta 3000
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});