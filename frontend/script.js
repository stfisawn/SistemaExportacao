
const API = '/api/produtos';

const form = document.getElementById('formProduto');
const lista = document.getElementById('listaProdutos');
const seletor = document.getElementById('produtoConversao');

let produtos = [];

const dinheiro = (valor, moeda = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: moeda
    }).format(valor);
};

// Cadastrar produto
form.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const produto = {
        nome: document.getElementById('nome').value.trim(),
        descricao: document.getElementById('descricao').value.trim(),
        precoCusto: Number(document.getElementById('precoCusto').value),
        quantidade: Number(document.getElementById('quantidade').value)
    };

    try {
        const resposta = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produto)
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro);
        }

        alert('Produto cadastrado com sucesso!');
        form.reset();
        carregarProdutos();

    } catch (erro) {
        alert(erro.message);
    }
});

// Listar produtos
async function carregarProdutos() {
    try {
        const resposta = await fetch(API);
        produtos = await resposta.json();

        lista.replaceChildren();
        seletor.replaceChildren();

        const opcaoInicial = document.createElement('option');
        opcaoInicial.value = '';
        opcaoInicial.textContent = 'Selecione um produto';
        seletor.appendChild(opcaoInicial);

        produtos.forEach(produto => {
            const venda = Number(produto.preco_custo) * 2;

            const card = document.createElement('div');
            card.className = 'produto';

            const titulo = document.createElement('h3');
            titulo.textContent = produto.nome;

            const descricao = document.createElement('p');
            descricao.textContent = produto.descricao || 'Sem descrição';

            const custo = document.createElement('p');
            custo.textContent = 'Custo: ' + dinheiro(Number(produto.preco_custo));

            const lucro = document.createElement('p');
            lucro.textContent = 'Lucro: ' + dinheiro(Number(produto.preco_custo));

            const preco = document.createElement('p');
            preco.textContent = 'Venda (+100%): ' + dinheiro(venda);

            const estoque = document.createElement('p');
            estoque.textContent = 'Estoque: ' + produto.quantidade;

            const excluir = document.createElement('button');
            excluir.textContent = 'Excluir produto';
            excluir.className = 'excluir';
            excluir.addEventListener('click', () => excluirProduto(produto.id));

            card.append(titulo, descricao, custo, lucro, preco, estoque, excluir);
            lista.appendChild(card);

            const opcao = document.createElement('option');
            opcao.value = produto.id;
            opcao.textContent = produto.nome;
            seletor.appendChild(opcao);
        });

        if (produtos.length === 0) {
            lista.textContent = 'Nenhum produto cadastrado.';
        }

    } catch (erro) {
        lista.textContent = 'Erro ao carregar produtos.';
    }
}

// Excluir produto
async function excluirProduto(id) {
    if (!confirm('Deseja realmente excluir este produto?')) return;

    const resposta = await fetch(`${API}/${id}`, {
        method: 'DELETE'
    });

    if (resposta.ok) {
        carregarProdutos();
    } else {
        alert('Não foi possível excluir o produto.');
    }
}

// Converter preço
document.getElementById('btnConverter').addEventListener('click', async () => {
    const id = Number(seletor.value);
    const moeda = document.getElementById('moeda').value;
    const resultado = document.getElementById('resultadoConversao');

    const produto = produtos.find(item => item.id === id);

    if (!produto) {
        resultado.textContent = 'Selecione um produto primeiro.';
        return;
    }

    resultado.textContent = 'Consultando cotação...';

    try {
        const resposta = await fetch(
            `https://api.frankfurter.dev/v1/latest?base=BRL&symbols=${moeda}`
        );

        if (!resposta.ok) throw new Error('Cotação indisponível.');

        const dados = await resposta.json();
        const precoVenda = Number(produto.preco_custo) * 2;
        const cotacao = dados.rates[moeda];
        const convertido = precoVenda * cotacao;

        resultado.textContent =
            `Produto: ${produto.nome} | ` +
            `Preço em reais: ${dinheiro(precoVenda)} | ` +
            `Preço convertido: ${dinheiro(convertido, moeda)} | ` +
            `Cotação de referência: ${cotacao}`;

    } catch (erro) {
        resultado.textContent = 'Não foi possível consultar a cotação. Tente novamente.';
    }
});

// Carregar produtos ao abrir a página
carregarProdutos();
