import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { authApi } from '../../services/api';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', fullName: '', phone: '', role: 'CLIENTE', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.register(form);
      login(data.user, data.token);
      const paths = { CLIENTE: '/dashboard/cliente', TECNICO: '/dashboard/tecnico', EMPRESA: '/dashboard/empresa' };
      navigate(paths[data.user.role] || '/dashboard/cliente');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'CLIENTE', label: 'Cliente', desc: 'Busco servicios' },
    { value: 'TECNICO', label: 'Técnico', desc: 'Ofrezco servicios' },
    { value: 'EMPRESA', label: 'Empresa', desc: 'Soy proveedor' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 lg:p-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[1200px] bg-black rounded-[32px] overflow-hidden flex flex-col lg:flex-row shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 min-h-[700px] relative"
      >
        
        {/* Left Panel - Premium Gradient Background */}
        <div className="hidden lg:flex w-[45%] relative p-12 flex-col justify-center overflow-hidden">
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

          <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-sm mx-auto text-center mt-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col items-center gap-3 mb-12"
            >
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <span className="material-symbols-outlined text-white text-3xl">handshake</span>
              </div>
              <span className="text-xl font-bold text-white tracking-[0.2em] uppercase mt-2">HomeFix Pro</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-4xl font-bold text-white mb-8 leading-tight"
            >
              Únete a la <br/>Comunidad
            </motion.h2>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="w-full space-y-4"
            >
               <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-4 border border-white/20 shadow-lg transform transition-transform">
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold">1</div>
                <span className="text-white font-medium">Registra tu información</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 border border-white/5 opacity-60">
                <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center text-sm font-bold">2</div>
                <span className="text-white font-medium">Confirma tu identidad</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 border border-white/5 opacity-60">
                <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center text-sm font-bold">3</div>
                <span className="text-white font-medium">Accede a la plataforma</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-[55%] p-8 sm:p-12 flex flex-col justify-center bg-[#050505] relative z-10">
          
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
             <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
               <span className="material-symbols-outlined text-white text-xl">handshake</span>
             </div>
             <span className="text-xl font-bold text-white tracking-widest uppercase">HomeFix Pro</span>
          </div>

          <div className="max-w-xl w-full mx-auto">
            <div className="text-center lg:text-left mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
              <p className="text-zinc-400 text-sm">Completa tus datos para registrarte en Managua.</p>
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

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* Role Selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider text-center lg:text-left">Soy un...</label>
                <div className="grid grid-cols-3 gap-3">
                  {roles.map(r => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setForm({ ...form, role: r.value })}
                      className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl transition-all border ${
                        form.role === r.value 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-zinc-800 bg-[#111] hover:bg-zinc-900 hover:border-zinc-700'
                      }`}
                    >
                      {form.role === r.value && (
                        <motion.div
                          layoutId="activeRole"
                          className="absolute inset-0 bg-blue-500/10 rounded-xl border border-blue-500"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <span className={`text-sm font-bold z-10 ${form.role === r.value ? 'text-blue-400' : 'text-zinc-300'}`}>{r.label}</span>
                      <span className="text-[10px] text-zinc-500 mt-1 z-10 hidden sm:block">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Nombre Completo</label>
                  <input type="text" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })}
                    placeholder="ej. María Pérez" required
                    className="w-full px-5 py-4 bg-[#111] text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-white transition-all border border-zinc-800 placeholder-zinc-600" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Correo Electrónico</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="ej. maria@gmail.com" required
                    className="w-full px-5 py-4 bg-[#111] text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-white transition-all border border-zinc-800 placeholder-zinc-600" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Teléfono</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="8888-0000"
                    className="w-full px-5 py-4 bg-[#111] text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-white transition-all border border-zinc-800 placeholder-zinc-600" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Contraseña</label>
                  <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Mínimo 8 caracteres" required minLength={8}
                    className="w-full px-5 py-4 bg-[#111] text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-white transition-all border border-zinc-800 placeholder-zinc-600" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Barrio / Zona</label>
                  <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                    placeholder="Altamira, Los Robles..."
                    className="w-full px-5 py-4 bg-[#111] text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-white transition-all border border-zinc-800 placeholder-zinc-600" />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={loading}
                className="w-full bg-white text-black rounded-xl py-4 font-bold hover:bg-zinc-200 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
              >
                {loading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                Crear Cuenta
              </motion.button>
            </form>

            <div className="mt-8 text-center text-sm text-zinc-500">
              ¿Ya tienes cuenta? <Link to="/login" className="text-white font-bold hover:underline">Inicia Sesión</Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
