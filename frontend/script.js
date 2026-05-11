async function cadastrar(event) {
 // impede o formulário de recarregar a página
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const codigo = document.getElementById("codigo_barras").value;
    const descricao = document.getElementById("descricao").value;
    const quantidade = document.getElementById("quantidade").value;
    const preco = document.getElementById("preco").value;

    // envia para o backend
    await fetch("http://localhost:3000/produtos", {

        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        //Transforma os dados em JSON para enviar ao backend
        body: JSON.stringify({
            codigo_barras: codigo,
            nome: nome,
            descricao: descricao,
            quantidade: quantidade,
            preco: preco
        })
    });

    // atualiza a lista automaticamente
    carregarProdutos();
    // limpa os campos do formulário
    document.getElementById("form-produto").reset();
    alert("Produto cadastrado!");
}


// CARREGAR PRODUTOS AUTOMATICAMENTE
window.onload = carregarProdutos;

// MOSTRAR PRODUTOS
async function carregarProdutos() {

    // busca produtos no backend
    const resposta = await fetch("http://localhost:3000/produtos");

    // transforma JSON em array JS
    const produtos = await resposta.json();

    const lista = document.getElementById("lista-produtos");
    lista.innerHTML = "";

    // percorre todos produtos
    produtos.forEach(produto => {

        // adiciona HTML na lista
        lista.innerHTML += `
        
            <li>

                <strong>${produto.nome}</strong><br>

                Código: ${produto.codigo_barras}<br>

                Descrição: ${produto.descricao}<br>

                Quantidade: ${produto.quantidade}<br>

                Preço: R$ ${produto.preco}

                <button onclick="editarProduto(${produto.id})">
                    Editar
                </button>
                <button onclick="deletarProduto(${produto.id})">
                    Deletar
                </button>
                <hr>

            </li>
        `;
    });
}

async function deletarProduto(id) {

    const confirmar = confirm(//abre o popup
        "Tem certeza que deseja deletar este produto?"
    );

    if (!confirmar) {
        return;
    }

    await fetch(`http://localhost:3000/produtos/${id}`, {

        method: "DELETE"
    });

    carregarProdutos();
}

async function editarProduto(id) {

    const codigo = prompt("Novo código de barras:");
    const nome = prompt("Novo nome:");
    const descricao = prompt("Nova descrição:");
    const quantidade = prompt("Nova quantidade:");
    const preco = prompt("Novo preço:");

    await fetch(`http://localhost:3000/produtos/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            codigo_barras: codigo,

            nome: nome,

            descricao: descricao,

            quantidade: quantidade,

            preco: preco
        })
    });

    carregarProdutos();
}