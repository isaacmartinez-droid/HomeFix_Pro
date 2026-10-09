import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { authApi } from '../../services/api';
import { motion, useReducedMotion } from 'framer-motion';
import './LoginPage.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
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
    <div className="homefix-login">
      <motion.div 
        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="homefix-login__card"
      >
        
        {/* Left Panel - Premium Gradient Background */}
        <div className="homefix-login__intro" aria-hidden="true">
          {/* Animated Background Blobs */}
          <div className="absolute inset-0 bg-[#0a0a0a] z-0"></div>
          <motion.div 
             animate={reducedMotion ? {} : { scale: [1, 1.2, 1], rotate: [0, 90, 0] }} 
             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
             className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-700 rounded-full mix-blend-screen filter blur-[120px] opacity-40 z-0"
          />
          <motion.div 
             animate={reducedMotion ? {} : { scale: [1, 1.3, 1], rotate: [0, -90, 0] }} 
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute top-1/3 -right-32 w-[400px] h-[400px] bg-cyan-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 z-0"
          />
          <motion.div 
             animate={reducedMotion ? {} : { scale: [1, 1.1, 1], y: [0, 50, 0] }} 
             transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
             className="absolute -bottom-32 left-1/4 w-[400px] h-[400px] bg-indigo-700 rounded-full mix-blend-screen filter blur-[120px] opacity-30 z-0"
          />

          <div className="homefix-login__intro-content">
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
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-4xl font-bold text-white mb-8 leading-tight"
            >
              Comienza <br/>con Nosotros
            </motion.h2>

            <motion.div 
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="w-full space-y-4"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-4 border border-white/20 shadow-lg transform transition-transform">
                <div className="shrink-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold">1</div>
                <span className="text-white font-medium">Ingresa a tu cuenta</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 border border-white/5 opacity-60">
                <div className="shrink-0 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center text-sm font-bold">2</div>
                <span className="text-white font-medium">Explora servicios</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 border border-white/5 opacity-60">
                <div className="shrink-0 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center text-sm font-bold">3</div>
                <span className="text-white font-medium">Configura tu perfil</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="homefix-login__form-panel">
          
          <div className="homefix-login__mobile-brand">
             <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
               <span className="material-symbols-outlined text-white text-xl">home_repair_service</span>
             </div>
             <span className="homefix-login__mobile-brand-name">HomeFix Pro</span>
          </div>

          <div className="homefix-login__form-content">
            <div className="homefix-login__heading">
              <h1 >Iniciar Sesión</h1>
              <p >Ingresa tus credenciales para acceder a la plataforma.</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                role="alert" id="login-error" className="homefix-login__error mb-6 w-full px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-start gap-2"
              >
                <span className="material-symbols-outlined text-sm shrink-0" aria-hidden="true">error</span>
                <span className="min-w-0">{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="homefix-login__form" aria-busy={loading}>
              <div>
                <label htmlFor="login-email">Correo Electrónico</label>
                <input
                  id="login-email"
                  name="email"
                  autoComplete="username"
                  inputMode="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-describedby={error ? "login-error" : undefined}
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="ej. juan@gmail.com"
                  required
                  className="homefix-login__input"
                />
              </div>

              <div>
                <label htmlFor="login-password">Contraseña</label>
                <input
                  id="login-password"
                  name="password"
                  autoComplete="current-password"
                  aria-describedby={error ? "login-error" : "login-help"}
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Ingresa tu contraseña"
                  required
                  className="homefix-login__input"
                />
              </div>

              <p id="login-help" className="homefix-login__help">¿Olvidaste tu contraseña? Contacta al administrador para recuperar el acceso.</p>

              <motion.button
                whileHover={reducedMotion ? {} : { scale: 1.01 }}
                whileTap={reducedMotion ? {} : { scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="homefix-login__submit"
              >
                {loading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                {loading ? "Ingresando…" : "Ingresar a la plataforma"}
              </motion.button>
            </form>

            <div className="homefix-login__register">
              ¿No tienes cuenta? <Link to="/register" className="text-white font-bold hover:underline">Regístrate</Link>
            </div>


          </div>
        </div>
      </motion.div>
    </div>
  );
}
