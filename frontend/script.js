let produtosGlobais = [];//variável global para armazenar os produtos

function mostrarMensagem(mensagem, tipo = 'info') {
    const divMensagem = document.getElementById("mensagem");
    divMensagem.textContent = mensagem;
    divMensagem.className = `mensagem ${tipo}`;
    setTimeout(() => {
        divMensagem.textContent = '';
        divMensagem.className = 'mensagem';
    }, 5000); // Limpa após 5 segundos
}

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
        mostrarMensagem("Preencha o código, nome, quantidade e preço corretamente.", 'erro');
        return;
    }

    const codigoDuplicado = produtosGlobais.some(produto => produto.codigo_barras.toLowerCase() === codigo.toLowerCase());
    if (codigoDuplicado) {
        mostrarMensagem("Código de barras já cadastrado.", 'erro');
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
        mostrarMensagem("Erro ao cadastrar produto: " + (erro.erro || erro.mensagem || resposta.statusText), 'erro');
        return;
    }

    document.getElementById("form-produto").reset();
    mostrarMensagem("Produto cadastrado!", 'sucesso');
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
        
            <li data-id="${produto.id}">

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
        "Tem certeza que deseja deletar este produto permanentemente? Esta ação não pode ser desfeita."
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
    const li = document.querySelector(`li[data-id="${id}"]`);
    const produto = produtosGlobais.find(p => p.id === id);

    li.innerHTML = `
        <input type="text" value="${produto.nome}" id="edit-nome-${id}" placeholder="Nome"><br>
        Código: <input type="text" value="${produto.codigo_barras}" id="edit-codigo-${id}" placeholder="Código de Barras"><br>
        Descrição: <textarea id="edit-descricao-${id}" placeholder="Descrição">${produto.descricao}</textarea><br>
        Quantidade: <input type="number" value="${produto.quantidade}" id="edit-quantidade-${id}" min="1"><br>
        Preço: R$ <input type="number" value="${produto.preco}" id="edit-preco-${id}" step="0.01" min="0"><br>
        <div class="acoes">
            <button class="btn-salvar" onclick="salvarEdicao(${id})"><i class="fa-solid fa-check"></i></button>
            <button class="btn-cancelar" onclick="cancelarEdicao(${id})"><i class="fa-solid fa-times"></i></button>
        </div>
        <hr>
    `;
}

async function salvarEdicao(id) {
    const nome = document.getElementById(`edit-nome-${id}`).value.trim();
    const codigo = document.getElementById(`edit-codigo-${id}`).value.trim();
    const descricao = document.getElementById(`edit-descricao-${id}`).value.trim();
    const quantidade = Number(document.getElementById(`edit-quantidade-${id}`).value);
    const preco = Number(document.getElementById(`edit-preco-${id}`).value);

    if (!codigo || !nome || !quantidade || isNaN(preco)) {
        mostrarMensagem("Preencha todos os campos corretamente.", 'erro');
        return;
    }

    const resposta = await fetch(`http://localhost:3000/produtos/${id}`, {
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

    if (!resposta.ok) {
        const erro = await resposta.json().catch(() => ({}));
        mostrarMensagem("Erro ao atualizar produto: " + (erro.erro || erro.mensagem || resposta.statusText), 'erro');
        return;
    }

    mostrarMensagem("Produto atualizado!", 'sucesso');
    carregarProdutos();
}

function cancelarEdicao(id) {
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
            <li data-id="${produto.id}">
                <strong>${produto.nome}</strong><br>
                Código: ${produto.codigo_barras}<br>
                Descrição: ${produto.descricao}<br>
                Quantidade: ${produto.quantidade}<br>
                Preço: R$ ${produto.preco}<br>
                <div class="acoes">
                    <button class="btn-editar" onclick="editarProduto(${produto.id})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-deletar" onclick="deletarProduto(${produto.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
                <hr>
            </li>
        `;
    });
}
