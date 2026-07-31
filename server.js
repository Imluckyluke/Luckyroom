require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/groups');
const conversationRoutes = require('./routes/conversations');
const notificationRoutes = require('./routes/notifications');
const uploadRoutes = require('./routes/uploads');
const logRoutes = require('./routes/logs');
const roleRoutes = require('./routes/roles');
const userRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');
const superadminRoutes = require('./routes/superadmin');
const stickerRoutes = require('./routes/stickers');
const { registerSocketHandlers } = require('./sockets');
const { registerDashboardNamespace } = require('./sockets/dashboard');
const { registerCoreListeners } = require('./events/listeners');
const logger = require('./helpers/logger');
const { ensureDefaultSuperAdmin } = require('./helpers/superAdmin');
const { createRateLimiter } = require('./helpers/rateLimiter');
const config = require('./config');

const path = require('path');

registerCoreListeners();
ensureDefaultSuperAdmin();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Standard, IP-based rate limit applied to every /api request.
const standardLimiter = createRateLimiter({
  name: 'standard',
  windowMs: config.rateLimit.standard.windowMs,
  max: config.rateLimit.standard.max
});
app.use('/api', standardLimiter);

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/stickers', stickerRoutes);

app.use((err, req, res, next) => {
  logger.error('http.error', err.message, { meta: { stack: err.stack } });
  res.status(500).json({ error: 'Internal server error' });
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CORS_ORIGIN || '*' } });
registerSocketHandlers(io);
registerDashboardNamespace(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Chat backend running on port ${PORT}`));
