import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../utils/api';

const PreventiveMaintenance = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('tasks');
  const [form, setForm] = useState({ task_name: '', frequency_days: '', next_due: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    API.get('/tasks')
      .then(res => setTasks(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/tasks', form);
      setSuccess('Task created!');
      setForm({ task_name: '', frequency_days: '', next_due: '' });
      const res = await API.get('/tasks');
      setTasks(res.data);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await API.patch(`/tasks/${id}/complete`);
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-900 rounded-full blur-[200px] opacity-10 z-0" />

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-64 backdrop-blur-xl bg-white/3 border-r border-white/10 flex flex-col p-6"
        >
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-xs font-bold">TS</span>
              </div>
              <span className="text-white font-bold text-sm uppercase tracking-wider">Tata Steel</span>
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-widest pl-11">PMMS</p>
          </div>

          <nav className="flex-1 space-y-2">
            <button onClick={() => navigate('/')}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white text-sm font-medium uppercase tracking-wider transition-all">
              Dashboard
            </button>
            <button onClick={() => navigate('/breakdown')}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white text-sm font-medium uppercase tracking-wider transition-all">
              Breakdown
            </button>
            <button onClick={() => navigate('/preventive')}
              className="w-full text-left px-4 py-3 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 text-sm font-medium uppercase tracking-wider">
              Preventive
            </button>

            <button
              onClick={() => navigate('/ai-diagnostics')}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white text-sm font-medium uppercase tracking-wider transition-all"
            >
              AI Diagnostics
            </button>
          </nav>

          <button onClick={() => { localStorage.clear(); navigate('/login'); }}
            className="px-4 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-600/20 text-sm font-medium uppercase tracking-wider transition-all">
            Logout
          </button>
        </motion.div>

        {/* Main */}
        <div className="flex-1 p-8">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mb-2">
            Preventive <span className="text-red-400">Maintenance</span>
          </motion.h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-8">Scheduled Maintenance Tasks</p>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {['tasks', 'create'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-2 rounded-lg text-sm font-medium uppercase tracking-widest transition-all ${tab === t
                    ? 'bg-red-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                  }`}>
                {t === 'tasks' ? 'All Tasks' : 'Add Task'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === 'tasks' ? (
              <motion.div key="tasks" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {loading ? (
                  <p className="text-gray-500">Loading...</p>
                ) : (
                  <div className="space-y-4">
                    {tasks.length === 0 && (
                      <p className="text-gray-500 text-center py-20">No tasks yet. Add one first.</p>
                    )}
                    {tasks.map((task, i) => (
                      <motion.div key={task._id}
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-white font-bold">{task.task_name}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${task.status === 'Completed'
                                ? 'text-green-400 bg-green-600/20 border-green-500/30'
                                : 'text-yellow-400 bg-yellow-600/20 border-yellow-500/30'
                              }`}>
                              {task.status}
                            </span>
                          </div>
                          <p className="text-gray-500 text-xs">Every {task.frequency_days} days</p>
                          {task.next_due && (
                            <p className="text-gray-500 text-xs mt-1">
                              Due: {new Date(task.next_due).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {task.status !== 'Completed' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => handleComplete(task._id)}
                            className="px-5 py-2 bg-green-600/20 border border-green-500/30 text-green-400 rounded-lg text-xs uppercase tracking-widest hover:bg-green-600/40 transition-all">
                            Mark Done
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="create" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 max-w-2xl">
                  {success && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="mb-6 px-4 py-3 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
                      {success}
                    </motion.div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">Task Name</label>
                      <input type="text" placeholder="e.g. Lubrication Check"
                        value={form.task_name}
                        onChange={e => setForm({ ...form, task_name: e.target.value })}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">Frequency (days)</label>
                      <input type="number" placeholder="e.g. 30"
                        value={form.frequency_days}
                        onChange={e => setForm({ ...form, frequency_days: e.target.value })}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">Next Due Date</label>
                      <input type="date"
                        value={form.next_due}
                        onChange={e => setForm({ ...form, next_due: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all"
                      />
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      type="submit" disabled={submitting}
                      className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-lg transition-all uppercase tracking-widest text-sm disabled:opacity-50">
                      {submitting ? 'Creating...' : 'Add Task'}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PreventiveMaintenance;