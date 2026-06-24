const db = require('.../config/db');

exports.getAllTasks = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM tasks ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Ошибка в getAllTasks:', error);
        res.statur(500).json({error: 'Внутренняя ошибка сервера при получении задач' });
    }
};