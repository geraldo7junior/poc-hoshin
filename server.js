const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Função para ler dados do arquivo JSON
const readData = () => {
    if (!fs.existsSync('data.json')) {
        fs.writeFileSync('data.json', '[]');
    }
    const rawData = fs.readFileSync('data.json');
    return JSON.parse(rawData);
};

// Função para escrever dados no arquivo JSON
const writeData = (data) => {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
};

// Endpoint para salvar os dados
app.post('/submit', (req, res) => {
    const projectData = req.body;

    // Ler dados existentes
    let data = readData();

    // Adicionar novo projeto
    data.push(projectData);

    // Salvar dados
    writeData(data);
    res.redirect('/');
});

// Endpoint para obter os dados
app.get('/data', (req, res) => {
    const data = readData();
    res.json(data);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
