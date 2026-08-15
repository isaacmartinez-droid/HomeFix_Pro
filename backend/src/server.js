require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded KYC files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- Routes ---
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/services', require('./routes/services.routes'));
app.use('/api/requests', require('./routes/requests.routes'));
app.use('/api/reviews', require('./routes/reviews.routes'));
app.use('/api/notifications', require('./routes/notifications.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/verification', require('./routes/verification.routes'));
app.use('/api/schedule', require('./routes/schedule.routes'));
app.use('/api/reports', require('./routes/reports.routes'));

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'HomeFix Pro API funcionando correctamente', timestamp: new Date().toISOString() });
});

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.url}` });
});

// --- Error Handler ---
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ message: err.message || 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`\n🔧 HomeFix Pro API`);
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health\n`);
});
