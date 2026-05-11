let produtosGlobais = [];//variável global para armazenar os produtos

async function cadastrar(event) {
    if (event) {
        event.preventDefault();
    }

    const nome = document.getElementById("nome").value.trim();
    const codigo = document.getElementById("codigo_barras").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const quantidade = Number(document.getElementById("quantidade").value);
    const preco = Number(document.getElementById("preco").value);

    if (!codigo || !nome || !quantidade || isNaN(preco)) {
        alert("Preencha o código, nome, quantidade e preço corretamente.");
        return;
    }

    const codigoDuplicado = produtosGlobais.some(produto => produto.codigo_barras.toLowerCase() === codigo.toLowerCase());
    if (codigoDuplicado) {
        alert("Já existe produto com este código de barras.");
        return;
    }

    const resposta = await fetch("http://localhost:3000/produtos", {
        method: "POST",
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

    if (!resposta.ok) {
        const erro = await resposta.json().catch(() => ({}));
        alert("Erro ao cadastrar produto: " + (erro.erro || erro.mensagem || resposta.statusText));
        return;
    }

    document.getElementById("form-produto").reset();
    alert("Produto cadastrado!");
    carregarProdutos();
}

// CARREGAR PRODUTOS AUTOMATICAMENTE
window.onload = () => {
    document.getElementById("form-produto").addEventListener("submit", cadastrar);
    carregarProdutos();
};

// MOSTRAR PRODUTOS
async function carregarProdutos() {

    // busca produtos no backend
    const resposta = await fetch("http://localhost:3000/produtos");

    // transforma JSON em array JS
    produtosGlobais = await resposta.json();

    const lista = document.getElementById("lista-produtos");
    lista.innerHTML = "";

    // percorre todos produtos
    produtosGlobais.forEach(produto => {

        // adiciona HTML na lista
        lista.innerHTML += `
        
            <li>

                <strong>${produto.nome}</strong><br>

                Código: ${produto.codigo_barras}<br>

                Descrição: ${produto.descricao}<br>

                Quantidade: ${produto.quantidade}<br>

                Preço: R$ ${produto.preco}

                <div class="acoes">

    <button
    class="btn-editar"
    onclick="editarProduto(${produto.id})">

        <i class="fa-solid fa-pen"></i>

    </button>

    <button
    class="btn-deletar"
    onclick="deletarProduto(${produto.id})">

        <i class="fa-solid fa-trash"></i>

    </button>

</div>
                <hr>

            </li>
        `;
    });
}
//DELETAR
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
//EDITAR
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
//PESQUISAR
function pesquisarProdutos() {
    const texto = document.getElementById("pesquisa").value.toLowerCase();//pega valor escrito
    const lista = document.getElementById("lista-produtos");
    lista.innerHTML = "";

    const filtrados = produtosGlobais.filter(produto => {
        return produto.nome.toLowerCase().includes(texto) ||
            produto.codigo_barras.toLowerCase().includes(texto);
    });

    filtrados.forEach(produto => {
        lista.innerHTML += `
            <li>
                <strong>${produto.nome}</strong><br>
                Código: ${produto.codigo_barras}<br>
                Descrição: ${produto.descricao}<br>
                Quantidade: ${produto.quantidade}<br>
                Preço: R$ ${produto.preco}<br>
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
