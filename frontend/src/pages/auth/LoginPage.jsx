import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.login(form);
      login(data.user, data.token);
      const paths = {
        CLIENTE: '/dashboard/cliente',
        TECNICO: '/dashboard/tecnico',
        EMPRESA: '/dashboard/empresa',
        ADMIN: '/dashboard/admin',
      };
      navigate(paths[data.user.role] || '/dashboard/cliente');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 lg:p-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[1100px] bg-black rounded-[32px] overflow-hidden flex flex-col lg:flex-row shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 min-h-[650px] relative"
      >
        
        {/* Left Panel - Premium Gradient Background */}
        <div className="hidden lg:flex w-1/2 relative p-12 flex-col justify-center overflow-hidden">
          {/* Animated Background Blobs */}
          <div className="absolute inset-0 bg-[#0a0a0a] z-0"></div>
          <motion.div 
             animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} 
             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
             className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-700 rounded-full mix-blend-screen filter blur-[120px] opacity-40 z-0"
          />
          <motion.div 
             animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }} 
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute top-1/3 -right-32 w-[400px] h-[400px] bg-cyan-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 z-0"
          />
          <motion.div 
             animate={{ scale: [1, 1.1, 1], y: [0, 50, 0] }} 
             transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
             className="absolute -bottom-32 left-1/4 w-[400px] h-[400px] bg-indigo-700 rounded-full mix-blend-screen filter blur-[120px] opacity-30 z-0"
          />

          <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-sm mx-auto text-center mt-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col items-center gap-3 mb-12"
            >
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <span className="material-symbols-outlined text-white text-3xl">home_repair_service</span>
              </div>
              <span className="text-xl font-bold text-white tracking-[0.2em] uppercase mt-2">HomeFix Pro</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-4xl font-bold text-white mb-8 leading-tight"
            >
              Comienza <br/>con Nosotros
            </motion.h2>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="w-full space-y-4"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-4 border border-white/20 shadow-lg transform transition-transform">
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold">1</div>
                <span className="text-white font-medium">Ingresa a tu cuenta</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 border border-white/5 opacity-60">
                <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center text-sm font-bold">2</div>
                <span className="text-white font-medium">Explora servicios</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 border border-white/5 opacity-60">
                <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center text-sm font-bold">3</div>
                <span className="text-white font-medium">Configura tu perfil</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-[#050505] relative z-10">
          
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
             <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
               <span className="material-symbols-outlined text-white text-xl">home_repair_service</span>
             </div>
             <span className="text-xl font-bold text-white tracking-widest uppercase">HomeFix Pro</span>
          </div>

          <div className="max-w-md w-full mx-auto">
            <div className="text-center lg:text-left mb-10">
              <h1 className="text-3xl font-bold text-white mb-3">Iniciar Sesión</h1>
              <p className="text-zinc-400 text-sm">Ingresa tus credenciales para acceder a la plataforma.</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 w-full px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Correo Electrónico</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="ej. juan@gmail.com"
                  required
                  className="w-full px-5 py-4 bg-[#111] text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-white transition-all border border-zinc-800 placeholder-zinc-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Contraseña</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Ingresa tu contraseña"
                  required
                  className="w-full px-5 py-4 bg-[#111] text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-white transition-all border border-zinc-800 placeholder-zinc-600"
                />
              </div>

              <div className="flex justify-between items-center text-xs mt-2">
                 <span className="text-zinc-500">Mínimo 6 caracteres.</span>
                 <a href="#" className="text-zinc-400 hover:text-white transition-colors">¿Olvidaste tu contraseña?</a>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black rounded-xl py-4 font-bold hover:bg-zinc-200 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
              >
                {loading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                Ingresar a la plataforma
              </motion.button>
            </form>

            <div className="mt-8 text-center text-sm text-zinc-500">
              ¿No tienes cuenta? <Link to="/register" className="text-white font-bold hover:underline">Regístrate</Link>
            </div>

            {/* Demo credentials */}
            <div className="mt-8 pt-6 border-t border-zinc-800 text-center text-xs text-zinc-500">
              <p className="mb-2">Credenciales Demo (Contraseña: 123456):</p>
              <div className="flex flex-col gap-1 items-center">
                <span className="font-mono bg-zinc-900 px-2 py-1 rounded">Admin: admin@homefix.pro</span>
                <span className="font-mono bg-zinc-900 px-2 py-1 rounded">Técnico: juan@tech.com</span>
                <span className="font-mono bg-zinc-900 px-2 py-1 rounded">Cliente: maria@ejemplo.com</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
