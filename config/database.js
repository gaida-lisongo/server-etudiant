const mysql = require('mysql2/promise');

class Database {
    constructor() {
        if (!Database.instance) {
            this.pool = mysql.createPool({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'your_username',
                password: process.env.DB_PASSWORD || 'your_password',
                database: process.env.DB_NAME || 'your_database',
                waitForConnections: true,
                connectionLimit: 150,
                queueLimit: 100,
                connectTimeout: 60000,
                enableKeepAlive: true,
                keepAliveInitialDelay: 10000
            });
            Database.instance = this;
        }
        return Database.instance;
    }

    getPool() {
        return this.pool;
    }
}

const instance = new Database();
Object.freeze(instance);

module.exports = instance;