const memjs = require('memjs');
const database = require('../config/database');

// Singleton pattern for Memcached client
class MemcachedClient {
    constructor() {
        if (!MemcachedClient.instance) {
            this.client = memjs.Client.create(process.env.MEMCACHIER_SERVERS, {
                username: process.env.MEMCACHIER_USER,
                password: process.env.MEMCACHIER_PASSWORD
            });
            MemcachedClient.instance = this;
        }
        return MemcachedClient.instance;
    }

    async getFromCache(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, value) => {
                if (err) {
                    return reject(err);
                }
                if (value) {
                    return resolve(value.toString());
                }
                resolve(null);
            });
        });
    }

    async setInCache(key, value) {
        return new Promise((resolve, reject) => {
            this.client.set(key, value, { expires: 3600 }, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    async deleteFromCache(key) {
        return new Promise((resolve, reject) => {
            this.client.delete(key, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    getClient() {
        return this.client;
    }
}

const memcachedInstance = new MemcachedClient();

class Model {
    constructor(){
        this.db = database.getPool();
        this.cache = memcachedInstance;
    }
    
    async query(sql, params = []) {
        try {
            const [rows] = await this.db.execute(sql, params);
            return {
                success: true,
                message: 'Query executed successfully',
                data: rows
            };
        } catch (error) {
            console.error('Database query error:', error);
            return {
                success: false,
                message: 'Database query error',
                error: error.message
            };
        }
    }

    async getFromCache(key) {
        return await this.cache.getFromCache(key);
    }

    async setInCache(key, value) {
        return await this.cache.setInCache(key, value);
    }

    async deleteFromCache(key) {
        return await this.cache.deleteFromCache(key);
    }
}

module.exports = {
    Model,
    MemcachedClient: memcachedInstance
};