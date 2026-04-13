require('dotenv').config();

const config = {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
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

// Railway/Render provides DATABASE_URL; use it in production
if (process.env.DATABASE_URL) {
    config.url = process.env.DATABASE_URL;
    // Add SSL for production unless connecting via Railway private network
    const isPrivateNetwork = process.env.DATABASE_URL.includes('.railway.internal');
    if (process.env.NODE_ENV === 'production' && !isPrivateNetwork) {
        config.dialectOptions = {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        };
    }
} else {
    config.host = process.env.DB_HOST || 'localhost';
    config.port = parseInt(process.env.DB_PORT, 10) || 5432;
    config.database = process.env.DB_NAME || 'ecommerce_admin';
    config.username = process.env.DB_USER || 'postgres';
    config.password = process.env.DB_PASSWORD || '';
}

module.exports = config;