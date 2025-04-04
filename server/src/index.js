require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Environment indicator
const envName = process.env.ENV_NAME || 'Unknown';
const envColor = process.env.ENV_COLOR || 'gray';
console.log(`\n🚀 Starting server in ${envColor}${envName}\x1b[0m environment\n`);

// Database configuration
console.log('Database Configuration:');
console.log(`- Host: ${process.env.DB_HOST}`);
console.log(`- Database: ${process.env.DB_NAME}`);
console.log(`- User: ${process.env.DB_USER}`);
console.log(`- Port: ${process.env.DB_PORT}`);
console.log(`- Environment file: ${process.env.NODE_ENV}\n`);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    environment: envName,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const startServer = async () => {
  try {
    console.log('Attempting to connect to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync database models
    console.log('Synchronizing database models...');
    await sequelize.sync();
    console.log('✅ Database models synchronized.');

    app.listen(PORT, () => {
      console.log(`\n🌐 Server is running on port ${PORT}`);
      console.log(`📡 API URL: ${process.env.API_URL}`);
      console.log(`💾 Database: ${process.env.DB_NAME}`);
      console.log(`\nPress Ctrl+C to stop the server\n`);
    });
  } catch (error) {
    console.error('❌ Database connection error:', error);
    console.error('Error details:', error.message);
    if (error.original) {
      console.error('Original error:', error.original);
    }
  }
};

startServer(); 