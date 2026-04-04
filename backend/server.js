require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');
const path = require('path');

// Error logging setup
const fs = require('fs');
const logDir = '/app/logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, 'server.log');
const errorLogFile = path.join(logDir, 'errors.log');

// Logging utilities
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level}] ${message}\n`;
  console.log(logEntry.trim());
  try {
    fs.appendFileSync(logFile, logEntry);
  } catch (err) {
    console.error('Failed to write log:', err);
  }
}

function logError(message, error) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [ERROR] ${message}\n`;
  if (error) {
    logEntry += `Stack: ${error.stack}\n`;
  }
  logEntry += '\n';
  console.error(logEntry.trim());
  try {
    fs.appendFileSync(errorLogFile, logEntry);
  } catch (err) {
    console.error('Failed to write error log:', err);
  }
}

// Initialize app
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    log(`${req.method} ${req.path} ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  logError(`Request error: ${req.method} ${req.path}`, err);
  res.status(500).json({ 
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || require('crypto').randomBytes(64).toString('hex');
log(`JWT_SECRET initialized: ${JWT_SECRET.substring(0, 8)}...`);

// Initialize SQLite Database
const dbPath = process.env.DB_PATH || '/app/data/dashboard.sqlite';
log(`Initializing database at: ${dbPath}`);

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  log(`Created data directory: ${dataDir}`);
}

const db = new Database(dbPath);
log('Database connection established');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metric_name TEXT NOT NULL,
    value REAL NOT NULL,
    label TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);
log('Database tables initialized');

// Seed default admin user if not exists
const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('demo123', 10);
  db.prepare('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)').run(
    'admin', 'admin@amazing.com', hashedPassword, 'admin'
  );
  log('Default admin user created: admin / demo123');
}

// Seed sample analytics data
const analyticsCount = db.prepare('SELECT COUNT(*) as count FROM analytics').get().count;
if (analyticsCount === 0) {
  const metrics = [
    ['total_users', 1247, 'Total Users', 'users'],
    ['active_users', 892, 'Active Users', 'users'],
    ['new_signups', 156, 'New Signups', 'users'],
    ['revenue', 45678, 'Revenue', 'financial'],
    ['conversion_rate', 3.2, 'Conversion Rate', 'marketing'],
    ['bounce_rate', 42.5, 'Bounce Rate', 'marketing'],
    ['avg_session', 245, 'Avg Session (s)', 'engagement'],
    ['page_views', 89234, 'Page Views', 'engagement'],
  ];
  
  metrics.forEach(([name, value, label, category]) => {
    db.prepare('INSERT INTO analytics (metric_name, value, label, category) VALUES (?, ?, ?, ?)')
      .run(name, value, label, category);
  });
  log(`Seeded ${metrics.length} analytics metrics`);
}

// Seed sample activities
const activitiesCount = db.prepare('SELECT COUNT(*) as count FROM activities').get().count;
if (activitiesCount === 0) {
  const activities = [
    [1, 'logged_in', 'User logged in successfully'],
    [1, 'viewed_dashboard', 'Dashboard accessed'],
    [1, 'exported_report', 'Analytics report exported'],
    [1, 'updated_profile', 'Profile information updated'],
    [1, 'created_user', 'New user account created'],
  ];
  
  activities.forEach(([userId, action, details]) => {
    db.prepare('INSERT INTO activities (user_id, action, details) VALUES (?, ?, ?)')
      .run(userId, action, details);
  });
  log(`Seeded ${activities.length} activity records`);
}

// Auth middleware
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      log(`Auth failed: No token provided for ${req.path}`);
      return res.status(401).json({ error: 'No token provided' });
    }
    
    req.user = jwt.verify(token, JWT_SECRET);
    log(`Auth success: User ${req.user.username} accessed ${req.path}`);
    next();
  } catch (err) {
    logError('JWT verification failed', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Login
app.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    log(`Login attempt for user: ${username}`);
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      log(`Login failed: Invalid credentials for ${username}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    
    // Log activity
    db.prepare('INSERT INTO activities (user_id, action, details) VALUES (?, ?, ?)')
      .run(user.id, 'logged_in', 'User logged in successfully');
    
    log(`Login success: ${username}`);
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    logError('Login error', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Register
app.post('/register', (req, res) => {
  try {
    const { username, email, password } = req.body;
    log(`Registration attempt: ${username}`);
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password required' });
    }
    
    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)')
      .run(username, email, hashedPassword);
    
    log(`Registration success: ${username}`);
    res.status(201).json({ id: result.lastInsertRowid, username, email, role: 'user' });
  } catch (err) {
    logError('Registration error', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Get analytics
app.get('/analytics', authenticate, (req, res) => {
  try {
    const analytics = db.prepare('SELECT * FROM analytics').all();
    res.json(analytics);
  } catch (err) {
    logError('Analytics fetch error', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get users
app.get('/users', authenticate, (req, res) => {
  try {
    const users = db.prepare('SELECT id, username, email, role, created_at FROM users').all();
    res.json(users);
  } catch (err) {
    logError('Users fetch error', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get activities
app.get('/activities', authenticate, (req, res) => {
  try {
    const activities = db.prepare(`
      SELECT a.*, u.username 
      FROM activities a 
      LEFT JOIN users u ON a.user_id = u.id 
      ORDER BY a.created_at DESC 
      LIMIT 50
    `).all();
    res.json(activities);
  } catch (err) {
    logError('Activities fetch error', err);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// Get dashboard summary
app.get('/dashboard', authenticate, (req, res) => {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const totalActivities = db.prepare('SELECT COUNT(*) as count FROM activities').get().count;
    const totalMetrics = db.prepare('SELECT COUNT(*) as count FROM analytics').get().count;
    
    res.json({ totalUsers, totalActivities, totalMetrics });
  } catch (err) {
    logError('Dashboard fetch error', err);
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});

// Export analytics to CSV
app.get('/export/analytics', authenticate, (req, res) => {
  try {
    log('Export analytics requested');
    
    const analytics = db.prepare('SELECT * FROM analytics').all();
    const users = db.prepare('SELECT id, username, email, role, created_at FROM users').all();
    const activities = db.prepare('SELECT * FROM activities ORDER BY created_at DESC LIMIT 100').all();
    
    // Create CSV content
    let csv = '=== DASHBOARD EXPORT ===\n\n';
    csv += 'ANALYTICS DATA\n';
    csv += 'metric_type,metric_label,metric_value\n';
    analytics.forEach(row => {
      csv += `${row.metric_type},${row.metric_label},${row.metric_value}\n`;
    });
    
    csv += '\n\nUSERS DATA\n';
    csv += 'id,username,email,role,created_at\n';
    users.forEach(user => {
      csv += `${user.id},${user.username},${user.email},${user.role},${user.created_at}\n`;
    });
    
    csv += '\n\nACTIVITIES DATA\n';
    csv += 'id,user_id,action,details,created_at\n';
    activities.forEach(activity => {
      csv += `${activity.id},${activity.user_id},${activity.action},${activity.details},${activity.created_at}\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="dashboard-export-${new Date().toISOString().split('T')[0]}.csv"`);
    
    log('Export analytics success');
    res.send(csv);
  } catch (err) {
    logError('Export error', err);
    res.status(500).json({ error: 'Export failed' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  log(`🚀 Amazing Dashboard API running on port ${PORT}`);
  log(`📊 Database initialized at ${dbPath}`);
  log(`🔑 Default login: admin / demo123`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  log('SIGTERM received, shutting down gracefully');
  db.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  log('SIGINT received, shutting down gracefully');
  db.close();
  process.exit(0);
});
