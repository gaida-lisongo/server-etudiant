require('dotenv').config();
const express = require('express');
const cors = require('cors');
const database = require('./config/database');
const { MemcachedClient } = require('./models/model');
const { Etudiant } = require('./models'); // Import models if needed

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/hello', (req, res) => {
    res.json({ message: 'Hello World!' });
});

// Health check route that tests both DB and Cache
app.get('/health', async (req, res) => {
    try {
        // Test database connection
        const db = database.getPool();
        await db.query('SELECT 1');

        // Test cache connection
        const cache = MemcachedClient;
        await cache.setInCache('test', 'ok');
        const cacheTest = await cache.getFromCache('test');
        await cache.deleteFromCache('test');

        res.json({
            status: 'healthy',
            database: 'connected',
            cache: cacheTest === 'ok' ? 'connected' : 'error'
        });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({
            status: 'unhealthy',
            database: error.message.includes('database') ? 'error' : 'unknown',
            cache: error.message.includes('cache') ? 'error' : 'unknown',
            error: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something broke!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start the server
const startServer = async () => {
    try {
        // Test database connection before starting server
        const etudiants = await Etudiant.getAllEtudiants();
        console.log('✅ Database connection successful');
        console.log(`Found ${etudiants.data.length} etudiants in the database`);
        
        // Test cache connection
        const cache = MemcachedClient;
        await cache.setInCache('startup_test', 'ok');
        const cacheTest = await cache.getFromCache('startup_test');
        await cache.deleteFromCache('startup_test');
        console.log('✅ Cache connection successful');

        // Start listening
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
