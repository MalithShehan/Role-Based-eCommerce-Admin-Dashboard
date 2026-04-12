require('dotenv').config();

const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const bcrypt = require('bcryptjs');

const { sequelize, User } = require('./models');
const { authenticate } = require('./admin/auth');
const { getDashboardHandler } = require('./admin/dashboard');

// Resource configs
const UserResource = require('./admin/resources/user.resource');
const CategoryResource = require('./admin/resources/category.resource');
const ProductResource = require('./admin/resources/product.resource');
const OrderResource = require('./admin/resources/order.resource');
const OrderItemResource = require('./admin/resources/orderItem.resource');
const SettingResource = require('./admin/resources/setting.resource');

// Auth routes
const authRoutes = require('./routes/auth');

const PORT = process.env.PORT || 3000;

const start = async () => {
    // Dynamic imports for ESM-only AdminJS packages
    const { default: AdminJS } = await import('adminjs');
    const { default: AdminJSExpress } = await import('@adminjs/express');
    const AdminJSSequelize = await import('@adminjs/sequelize');

    // Register AdminJS adapter
    AdminJS.registerAdapter(AdminJSSequelize);

    const app = express();

    // Body parsing middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // API routes
    app.use('/api', authRoutes);

    // AdminJS configuration
    const adminJs = new AdminJS({
        resources: [
            UserResource,
            CategoryResource,
            ProductResource,
            OrderResource,
            OrderItemResource,
            SettingResource,
        ],
        rootPath: '/admin',
        branding: {
            companyName: 'eCommerce Admin',
            softwareBrothers: false,
        },
        dashboard: {
            handler: getDashboardHandler,
        },
    });

    // Session store
    const sessionStore = new SequelizeStore({
        db: sequelize,
    });

    // AdminJS router with authentication
    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
        adminJs,
        {
            authenticate,
            cookieName: 'adminjs',
            cookiePassword: process.env.SESSION_SECRET || 'session-secret-key',
        },
        null,
        {
            store: sessionStore,
            resave: false,
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET || 'session-secret-key',
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
            },
        },
    );

    app.use(adminJs.options.rootPath, adminRouter);

    // Sync database and start server
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        await sequelize.sync({ alter: true });
        console.log('Database synced successfully.');

        // Create session table
        sessionStore.sync();

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`AdminJS is available at http://localhost:${PORT}/admin`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
};

start();