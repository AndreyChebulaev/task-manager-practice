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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <AlertCircle size={12} /> Новая
          </span>
        );
        case 'in+progress':
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <Clock size={12} /> В процессе
            </span>
          );
          case 'done':
            return (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle size={12} /> Выполнено
              </span>
            );
            default:
              return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <CheckCircle size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Task Manager</h1>
          </div>
          <button 
            onClick={fetchTasks}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Обновить список"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">

        
      </main>
    </div>
  )
}