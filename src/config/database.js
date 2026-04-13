require('dotenv').config();

const config = {
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

if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres')) {
    config.url = process.env.DATABASE_URL;
    config.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    };
} else {
    config.host = process.env.DB_HOST || 'localhost';
    config.port = parseInt(process.env.DB_PORT, 10) || 5432;
    config.database = process.env.DB_NAME || 'ecommerce_admin';
    config.username = process.env.DB_USER || 'postgres';
    config.password = process.env.DB_PASSWORD || '';
}

module.exports = config;