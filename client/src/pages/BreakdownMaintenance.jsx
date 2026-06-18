import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../utils/api';

const priorityColor = (p) => {
  if (p === 'High') return 'text-red-400 bg-red-600/20 border-red-500/30';
  if (p === 'Medium') return 'text-yellow-400 bg-yellow-600/20 border-yellow-500/30';
  return 'text-green-400 bg-green-600/20 border-green-500/30';
};

const statusColor = (s) => {
  if (s === 'Open') return 'text-red-400';
  if (s === 'In Progress') return 'text-yellow-400';
  return 'text-green-400';
};

const BreakdownMaintenance = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('workorders');
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    description: '', priority: 'High', damage_code: '',
    functional_location: '', equipment: '',
    start_date: '', end_date: '', persons_required: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    API.get('/workorders')
      .then(res => setWorkOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/notifications', form);
      setSuccess('Notification created successfully!');
      setForm({
        description: '', priority: 'High', damage_code: '',
        functional_location: '', equipment: '',
        start_date: '', end_date: '', persons_required: ''
      });
      const res = await API.get('/workorders');
      setWorkOrders(res.data);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.patch(`/workorders/${id}/status`, {
        status,
        completed: status === 'Completed'
      });
      const res = await API.get('/workorders');
      setWorkOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-red-600 rounded-full blur-[200px] opacity-10 z-0" />

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
              className="w-full text-left px-4 py-3 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 text-sm font-medium uppercase tracking-wider">
              Breakdown
            </button>
            <button onClick={() => navigate('/preventive')}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white text-sm font-medium uppercase tracking-wider transition-all">
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
            Breakdown <span className="text-red-400">Maintenance</span>
          </motion.h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-8">Notifications & Work Orders</p>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {['workorders', 'create'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-2 rounded-lg text-sm font-medium uppercase tracking-widest transition-all ${tab === t
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                  }`}>
                {t === 'workorders' ? 'Work Orders' : 'Create Notification'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === 'workorders' ? (
              <motion.div key="wo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                {loading ? (
                  <p className="text-gray-500">Loading...</p>
                ) : (
                  <div className="space-y-4">
                    {workOrders.length === 0 && (
                      <p className="text-gray-500 text-center py-20">No work orders yet. Create a notification first.</p>
                    )}
                    {workOrders.map((wo, i) => (
                      <motion.div key={wo._id}
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-white font-bold">WO-{wo._id.slice(-4).toUpperCase()}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColor(wo.notification_id?.priority)}`}>
                              {wo.notification_id?.priority}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm">{wo.notification_id?.description}</p>
                          <p className="text-gray-500 text-xs mt-1">{wo.assigned_team}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-sm font-medium ${statusColor(wo.status)}`}>{wo.status}</span>
                          <select
                            value={wo.status}
                            onChange={(e) => handleStatusUpdate(wo._id, e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-red-500"
                          >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="create" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 max-w-2xl">
                  {success && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="mb-6 px-4 py-3 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
                      {success}
                    </motion.div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {[
                      { label: 'Description', key: 'description', type: 'text', placeholder: 'Enter description...' },
                      { label: 'Damage Code', key: 'damage_code', type: 'text', placeholder: 'e.g. DC001' },
                      { label: 'Functional Location', key: 'functional_location', type: 'text', placeholder: 'e.g. Plant A' },
                      { label: 'Equipment', key: 'equipment', type: 'text', placeholder: 'e.g. Motor M1' },
                      { label: 'Start Date', key: 'start_date', type: 'date', placeholder: '' },
                      { label: 'End Date', key: 'end_date', type: 'date', placeholder: '' },
                      { label: 'Persons Required', key: 'persons_required', type: 'number', placeholder: 'e.g. 3' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">{field.label}</label>
                        <input type={field.type} placeholder={field.placeholder}
                          value={form[field.key]}
                          onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-all"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">Priority</label>
                      <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all">
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      type="submit" disabled={submitting}
                      className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-lg transition-all uppercase tracking-widest text-sm disabled:opacity-50">
                      {submitting ? 'Creating...' : 'Create Notification'}
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

export default BreakdownMaintenance;