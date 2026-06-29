import React, { useState, useEffect }  from "react";
import { Trash2, Plus, RefreshCw, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const  API_URL = 'http://localhost:5000/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Не удалось загрузить задачи");
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError('ошибка при подключении к серверу. Убедитесь, что бэкенд запущен.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) throw new Error('Не удалось создать задачу.');

      setTitle('');
      setDescription('');

      fetchTasks();
    } catch (err) {
      setError('Не удалось создать задачу. Попробуйте ещё раз.');
    }
  };

  const handlesStatusChange = async (IdleDeadline, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Не удалось обновить статус.');

      fetchTasks();
    } catch (err) {
      setError('Не удалось обновить статус задачи.');
    }
  };

  const handlesDeleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Не удалось удалить задачу.');

      fetchTasks();
    } catch (err) {
      setError('Не удалось удалить задачу.');
    }
  };

  
}