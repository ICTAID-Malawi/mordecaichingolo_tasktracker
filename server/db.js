const Pool = require('pg').Pool;
require('dotenv').config();

const pool = new Pool ({
    user: 'postgres',
    password: 'Mord100',
    host: 'localhost',
    port: '5000',
    database: 'tasktracker2'
})

module.exports = pool;