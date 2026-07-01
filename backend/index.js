const express = require('express');
const cors = require('cors');
require('dotenv').config();

const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API менеджера задач работает');
});

app.use('/tasks', taskRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});