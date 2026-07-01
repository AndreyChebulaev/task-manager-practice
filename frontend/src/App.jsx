import React, { useState, useEffect } from 'react';
import { Trash2, Plus, RefreshCw, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const API_URL = 'http://127.0.0.1:5000/tasks';

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
      if (!response.ok) throw new Error('Не удалось загрузить задачи');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError('Ошибка подключения. Убедись, что бэкенд ЗАПУЩЕН в отдельном терминале на порту 5000!');
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

      if (!response.ok) throw new Error('Не удалось создать задачу');
      
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      setError('Не удалось создать задачу. Попробуйте еще раз.');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Не удалось обновить статус');
      
      fetchTasks();
    } catch (err) {
      setError('Не удалось обновить статус задачи.');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Не удалось удалить задачу');
      
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
      case 'in_progress':
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
        
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Создать задачу</h2>
            
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Название задачи</label>
                <input
                  type="text"
                  required
                  placeholder="Например: Выучить React"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Описание (необязательно)</label>
                <textarea
                  placeholder="Добавьте детали..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none placeholder:text-slate-400"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Plus size={18} /> Добавить
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Список задач
            <span className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full font-semibold">
              {tasks.length}
            </span>
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          {tasks.length === 0 && !loading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
              <p className="text-base font-medium mb-1">Задач пока нет</p>
              <p className="text-xs">Используйте форму слева, чтобы добавить первую задачу.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900 text-base">{task.title}</h3>
                      {getStatusBadge(task.status)}
                    </div>
                    {task.description && (
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{task.description}</p>
                    )}
                    <span className="block text-[11px] text-slate-400">
                      Создана: {new Date(task.created_at).toLocaleString('ru-RU')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-start">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="text-xs font-medium border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    >
                      <option value="new">Новая</option>
                      <option value="in_progress">В процессе</option>
                      <option value="done">Выполнено</option>
                    </select>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Удалить"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default App;