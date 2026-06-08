import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Torus, MeshDistortMaterial } from '@react-three/drei';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const FloatingTorus = () => (
  <Torus args={[1, 0.3, 16, 100]}>
    <MeshDistortMaterial
      color="#c0392b"
      attach="material"
      distort={0.2}
      speed={3}
      roughness={0.1}
      metalness={1}
    />
  </Torus>
);

const StatCard = ({ title, value, icon, delay, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer"
  >
    <div className="flex items-center justify-between mb-4">
      <span className="text-3xl">{icon}</span>
      <div className={`w-2 h-2 rounded-full ${color} animate-pulse`} />
    </div>
    <motion.h2
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay + 0.3 }}
      className="text-4xl font-bold text-white mb-1"
    >
      {value ?? '—'}
    </motion.h2>
    <p className="text-gray-400 text-sm uppercase tracking-widest">{title}</p>
  </motion.div>
);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get('/dashboard')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">

      {/* 3D Background */}
      <div className="absolute top-0 right-0 w-96 h-96 z-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#c0392b" />
          <FloatingTorus />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
        </Canvas>
      </div>

      {/* Glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-[180px] opacity-10 z-0" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-red-900 rounded-full blur-[150px] opacity-10 z-0" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen">

        {/* Sidebar */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
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
            <button
              onClick={() => navigate('/')}
              className="w-full text-left px-4 py-3 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 text-sm font-medium uppercase tracking-wider"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/breakdown')}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white text-sm font-medium uppercase tracking-wider transition-all"
            >
              Breakdown
            </button>
            <button
              onClick={() => navigate('/preventive')}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white text-sm font-medium uppercase tracking-wider transition-all"
            >
              Preventive
            </button>
          </nav>

          <button
            onClick={handleLogout}
            className="px-4 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-600/20 text-sm font-medium uppercase tracking-wider transition-all"
          >
            Logout
          </button>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl font-bold text-white">
              Welcome back, <span className="text-red-400">{user?.name}</span>
            </h1>
            <p className="text-gray-500 mt-1 uppercase tracking-widest text-sm">Plant Maintenance Overview</p>
          </motion.div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
            <StatCard title="Total Notifications" value={stats?.totalNotifications} icon="🔔" delay={0.2} color="bg-red-500" />
            <StatCard title="Open Work Orders" value={stats?.openWorkOrders} icon="📋" delay={0.3} color="bg-orange-500" />
            <StatCard title="Completed Orders" value={stats?.completedWorkOrders} icon="✅" delay={0.4} color="bg-green-500" />
            <StatCard title="Pending PM Tasks" value={stats?.pendingPreventiveTasks} icon="⚙️" delay={0.5} color="bg-yellow-500" />
          </div>

          {/* Module Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -5 }}
              onClick={() => navigate('/breakdown')}
              className="backdrop-blur-xl bg-white/5 border border-white/10 hover:border-red-500/50 rounded-2xl p-8 cursor-pointer transition-all duration-300 group"
            >
              <div className="text-4xl mb-4">⚡</div>
              <h2 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                Breakdown Maintenance
              </h2>
              <p className="text-gray-500 text-sm mb-6">Manage notifications and work orders</p>
              <span className="px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400 text-xs uppercase tracking-widest">
                Open Module →
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ y: -5 }}
              onClick={() => navigate('/preventive')}
              className="backdrop-blur-xl bg-white/5 border border-white/10 hover:border-red-500/50 rounded-2xl p-8 cursor-pointer transition-all duration-300 group"
            >
              <div className="text-4xl mb-4">🛡️</div>
              <h2 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                Preventive Maintenance
              </h2>
              <p className="text-gray-500 text-sm mb-6">Manage scheduled maintenance tasks</p>
              <span className="px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400 text-xs uppercase tracking-widest">
                Open Module →
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;