const express = require('express');
const mongoose = require('mongoose');
const os = require('os');

const router = express.Router();

// Basic health check
router.get('/health', (req, res) => {
  // readyState: 1 = connected, 2 = connecting, 0 = disconnected
  const isConnected = mongoose.connection.readyState === 1;

  res.status(isConnected ? 200 : 503).json({
    status: isConnected ? 'success' : 'error',
    message: 'API Operational',
    timestamp: new Date().toISOString(),
    database: {
      connected: isConnected,
      readyState: mongoose.connection.readyState
    }
  });
});

// Detailed health check with system info
router.get('/health/detailed', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  res.status(isConnected ? 200 : 503).json({
    status: isConnected ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: Math.floor(uptime),
      formatted: formatUptime(uptime)
    },
    database: {
      connected: isConnected,
      status: getConnectionStatus(mongoose.connection.readyState),
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      readyState: mongoose.connection.readyState
    },
    system: {
      platform: os.platform(),
      nodeVersion: process.version,
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`
      },
      cpus: os.cpus().length,
      freeMem: `${Math.round(os.freemem() / 1024 / 1024)} MB`
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database status only
router.get('/health/database', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;

  res.status(isConnected ? 200 : 503).json({
    status: isConnected ? 'connected' : 'disconnected',
    message: getConnectionStatus(mongoose.connection.readyState),
    timestamp: new Date().toISOString(),
    connection: {
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    }
  });
});

// Liveness probe (for Kubernetes/Docker)
router.get('/health/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString()
  });
});

// Readiness probe (for Kubernetes/Docker)
router.get('/health/ready', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;

  res.status(isConnected ? 200 : 503).json({
    status: isConnected ? 'ready' : 'not_ready',
    timestamp: new Date().toISOString(),
    checks: {
      database: isConnected ? 'pass' : 'fail'
    }
  });
});

// Helper function to format uptime
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
}

// Helper function to get connection status text
function getConnectionStatus(readyState) {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return states[readyState] || 'unknown';
}

module.exports = router;