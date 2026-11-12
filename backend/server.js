
const express = require('express');
const cors = require('cors');
const path = require('path');

const produtosRoutes = require('./routes/produtos');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/produtos', produtosRoutes);

app.get('/api', (req, res) => {
    res.json({
        mensagem: 'Sistema de Exportação funcionando!'
    });
});

const PORTA = 3000;

app.listen(PORTA, () => {
    console.log(`Sistema funcionando em http://localhost:${PORTA}`);
});
