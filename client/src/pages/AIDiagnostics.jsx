import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../utils/api';

const AIDiagnostics = () => {
  const navigate = useNavigate();
  const [issue, setIssue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!issue.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await API.post('/ai/diagnose', { issue });
      setResult(res.data.diagnosis);
      setHistory(prev => [{ issue, diagnosis: res.data.diagnosis }, ...prev]);
      setIssue('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const parseDiagnosis = (text) => {
    const cause = text.match(/PROBABLE CAUSE:(.*?)(?=RECOMMENDED ACTION:|$)/s)?.[1]?.trim();
    const action = text.match(/RECOMMENDED ACTION:(.*?)(?=PRIORITY:|$)/s)?.[1]?.trim();
    const priority = text.match(/PRIORITY:(.*?)$/s)?.[1]?.trim();
    return { cause, action, priority };
  };

  const priorityColor = (p) => {
    if (!p) return 'text-gray-400 bg-gray-600/20 border-gray-500/30';
    if (p.toLowerCase().includes('high')) return 'text-red-400 bg-red-600/20 border-red-500/30';
    if (p.toLowerCase().includes('medium')) return 'text-yellow-400 bg-yellow-600/20 border-yellow-500/30';
    return 'text-green-400 bg-green-600/20 border-green-500/30';
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-red-600 rounded-full blur-[200px] opacity-10 z-0" />

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
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white text-sm font-medium uppercase tracking-wider transition-all">
              Preventive
            </button>
            <button onClick={() => navigate('/ai-diagnostics')}
              className="w-full text-left px-4 py-3 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 text-sm font-medium uppercase tracking-wider">
              AI Diagnostics
            </button>
          </nav>

          <button onClick={() => { localStorage.clear(); navigate('/login'); }}
            className="px-4 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-600/20 text-sm font-medium uppercase tracking-wider transition-all">
            Logout
          </button>
        </motion.div>

        {/* Main */}
        <div className="flex-1 p-8 max-w-4xl">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mb-2">
            AI <span className="text-red-400">Fault Diagnosis</span>
          </motion.h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-8">Describe the issue, get instant analysis</p>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">
                Describe the Equipment Issue
              </label>
              <textarea
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="e.g. Motor making loud grinding noise and overheating..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-all resize-none"
              />
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit" disabled={loading}
                className="mt-4 w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-lg transition-all uppercase tracking-widest text-sm disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Diagnose Issue'}
              </motion.button>
            </div>
          </form>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-red-400 text-sm mb-6">{error}</motion.p>
          )}

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-xl bg-white/5 border border-red-500/30 rounded-2xl p-6 mb-8"
              >
                {(() => {
                  const { cause, action, priority } = parseDiagnosis(result);
                  return (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-white font-bold uppercase tracking-wider text-sm">Diagnosis Result</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColor(priority)}`}>
                          {priority || 'N/A'}
                        </span>
                      </div>
                      <div className="mb-4">
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Probable Cause</p>
                        <p className="text-gray-200 text-sm">{cause}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Recommended Action</p>
                        <p className="text-gray-200 text-sm">{action}</p>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* History */}
          {history.length > 1 && (
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">Previous Diagnoses</p>
              <div className="space-y-3">
                {history.slice(1).map((h, i) => (
                  <div key={i} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-gray-400 text-xs mb-1">Issue: {h.issue}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDiagnostics;