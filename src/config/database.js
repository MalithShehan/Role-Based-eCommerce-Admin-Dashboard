require('dotenv').config();

module.exports = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'ecommerce_admin',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: true,
        underscored: true,
    }
};