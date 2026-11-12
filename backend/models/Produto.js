
class Produto {
    constructor(nome, descricao, precoCusto, quantidade) {
        this.nome = nome;
        this.descricao = descricao;
        this.precoCusto = Number(precoCusto);
        this.quantidade = Number(quantidade);
    }

    calcularPrecoVenda() {
        return this.precoCusto * 2;
    }

    calcularLucro() {
        return this.precoCusto;
    }

    apresentarProduto() {
        return {
            nome: this.nome,
            descricao: this.descricao,
            precoCusto: this.precoCusto,
            precoVenda: this.calcularPrecoVenda(),
            lucro: this.calcularLucro(),
            quantidade: this.quantidade
        };
    }
}

module.exports = Produto;
