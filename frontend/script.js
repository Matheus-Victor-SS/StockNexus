async function cadastrar() {

    const nome = document.getElementById("nome").value;
    const codigo = document.getElementById("codigo_barras").value;
    const quantidade = document.getElementById("quantidade").value;
    const preco = document.getElementById("preco").value;
    const descricao = document.getElementById("descricao").value;

//espera a resposta do servidor para a requisição de cadastro do produto
    const resposta = await fetch("http://localhost:3000/produtos", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({//converte os dados do produto para JSON
            codigo_barras: codigo,
            nome: nome,
            descricao: descricao,
            quantidade: quantidade,
            preco: preco
            
        })
    });

    const dados = await resposta.json();

    console.log(dados);

    alert("Produto cadastrado!");
}