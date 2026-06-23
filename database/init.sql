DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
    id  SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status  VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'done')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks (title, description, status) VALUES
('Изучить React', 'Пройти базовый курс по React и Vite', 'new'),
('Создать REST API', 'Разработать бэкенд на Node.js + Express', 'in_progress');
