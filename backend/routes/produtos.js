
const express = require('express');
const router = express.Router();

const db = require('../config/database');
const Produto = require('../models/Produto');

// Listar produtos
router.get('/', (req, res) => {
    const produtos = db.prepare(
        'SELECT * FROM produtos ORDER BY id DESC'
    ).all();

    res.json(produtos);
});

// Cadastrar produto
router.post('/', (req, res) => {
    try {
        const { nome, descricao, precoCusto, quantidade } = req.body;

        if (
            !nome ||
            !Number.isFinite(Number(precoCusto)) ||
            Number(precoCusto) <= 0 ||
            !Number.isInteger(Number(quantidade)) ||
            Number(quantidade) < 0
        ) {
            return res.status(400).json({
                erro: 'Preencha os dados corretamente.'
            });
        }

        const produto = new Produto(
            nome,
            descricao,
            precoCusto,
            quantidade
        );

        const resultado = db.prepare(`
            INSERT INTO produtos
            (nome, descricao, preco_custo, quantidade)
            VALUES (?, ?, ?, ?)
        `).run(
            produto.nome,
            produto.descricao,
            produto.precoCusto,
            produto.quantidade
        );

        res.status(201).json({
            id: resultado.lastInsertRowid,
            ...produto.apresentarProduto()
        });

    } catch (erro) {
        res.status(500).json({
            erro: 'Erro ao cadastrar produto.'
        });
    }
});

// Excluir produto
router.delete('/:id', (req, res) => {
    const resultado = db.prepare(
        'DELETE FROM produtos WHERE id = ?'
    ).run(req.params.id);

    if (!resultado.changes) {
        return res.status(404).json({
            erro: 'Produto não encontrado.'
        });
    }

    res.json({ mensagem: 'Produto excluído!' });
});

module.exports = router;
