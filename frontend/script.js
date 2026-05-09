// CADASTRAR PRODUTO
async function cadastrar(event) {

    // impede o formulário de recarregar a página
    event.preventDefault();

    // pega os valores dos inputs
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
    // limpa formulário
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

                <hr>

            </li>
        `;
    });
}