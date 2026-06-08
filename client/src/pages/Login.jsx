import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const AnimatedSphere = () => (
  <Sphere visible args={[1, 100, 200]} scale={2.5}>
    <MeshDistortMaterial
      color="#c0392b"
      attach="material"
      distort={0.4}
      speed={2}
      roughness={0.2}
      metalness={0.8}
    />
  </Sphere>
);

const Login = () => {
  const [personal_no, setPersonalNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/login', { personal_no, password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-[#0a0a0a] flex items-center justify-center overflow-hidden">

      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={1} color="#c0392b" />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff0000" />
          <AnimatedSphere />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Red glow effects */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-red-600 rounded-full blur-[120px] opacity-20 z-0" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-800 rounded-full blur-[150px] opacity-15 z-0" />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-10 shadow-2xl">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600/20 border border-red-500/30 mb-4">
              <span className="text-2xl">⚙️</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wider uppercase">
              Plant Maintenance
            </h1>
            <p className="text-red-400 text-sm mt-1 tracking-widest uppercase">
              Management System
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">
                Personal Number
              </label>
              <input
                type="text"
                value={personal_no}
                onChange={(e) => setPersonalNo(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all duration-300"
                placeholder="Enter your personal number"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all duration-300"
                placeholder="Enter your password"
                required
              />
            </motion.div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-lg transition-all duration-300 uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Login'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;