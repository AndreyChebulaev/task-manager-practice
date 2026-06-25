const db = require('.../config/db');

exports.getAllTasks = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM tasks ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Ошибка в getAllTasks:', error);
        res.status(500).json({error: 'Внутренняя ошибка сервера при получении задач' });
    }
};

exports.creatTask = async (req, res) => {
    const { title, description } = req.body;
    
    if (!title) {
        return res.status(400).json({ error: 'Поле title обязательно для заполнения' });
    }

    try {
        const query = 'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *';
        const values = [title, description || ''];

        const result = await db.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка в createTask:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера при создании задачи'});
    }
};

exports.updateTaskStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ['new', 'in_progress', 'done'];
    if (!validStatus.includes(status)) {
        return res.status(400).json({ error: 'Недопустимый статус. Используйте: new, in_progress, done' });
    }

    try {
        const query = 'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *';
        const result = await db.query(query, [status, id]);

        if (result.rowCount == 0) {
            return res.status(404).json({ error: 'Задача с таким id не найдена' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка в updateTaskStatus:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера при обновлении статус '});
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);

        if (result.rowCount == 0) {
            return res.status(404).json({ error: 'Задачи с таким ID не найдена' });
        }

        res.status(200).json({ message: 'Задча успешно удалена', deleteTask: result.rows[0] });
    } catch (error) {
        console.error('Ошибка deleteTask:', error);
        res.status(500).json({ erros: 'Внутренняя ошибка сервера пр удалении задачи' });
    }
};