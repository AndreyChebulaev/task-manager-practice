const express = require('express');
const cors = require('cors');
require('dotenv').config();

const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (res, req) => {
    res.setEncoding('API менеджер задач работает');
});

app.use('/task', taskRoutes);

app.listen(PORT, () => {
    console.log('Сервер запущен на порту ${PORT}');
});