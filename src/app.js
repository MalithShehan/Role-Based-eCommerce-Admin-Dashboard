require('dotenv').config();

const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const bcrypt = require('bcryptjs');

const path = require('path');

const { sequelize, User } = require('./models/index.js');
const { authenticate } = require('./admin/auth');
const { getDashboardHandler } = require('./admin/dashboard');
const { getSettingsHandler } = require('./admin/settings');
const { getProfileHandler, updateProfileHandler, deleteAccountHandler } = require('./admin/profile');

// Resource config factories
const createUserResource = require('./admin/resources/user.resource');
const createCategoryResource = require('./admin/resources/category.resource');
const createProductResource = require('./admin/resources/product.resource');
const createOrderResource = require('./admin/resources/order.resource');
const createOrderItemResource = require('./admin/resources/orderItem.resource');
const createSettingResource = require('./admin/resources/setting.resource');

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

    // Register custom components
    const { ComponentLoader } = await import('adminjs');
    const componentLoader = new ComponentLoader();
    const dashboardComponent = componentLoader.add('Dashboard', path.join(__dirname, 'admin/components/dashboard.component.jsx'));
    const settingsComponent = componentLoader.add('Settings', path.join(__dirname, 'admin/components/settings.component.jsx'));
    const profileComponent = componentLoader.add('Profile', path.join(__dirname, 'admin/components/profile.component.jsx'));
    const customDeleteComponent = componentLoader.add('CustomDelete', path.join(__dirname, 'admin/components/custom-delete.component.jsx'));
    const customBulkDeleteComponent = componentLoader.add('CustomBulkDelete', path.join(__dirname, 'admin/components/custom-bulk-delete.component.jsx'));
    componentLoader.override('SidebarPages', path.join(__dirname, 'admin/components/sidebar-pages.component.jsx'));

    // Build resource configs with custom components
    const UserResource = createUserResource(customDeleteComponent, customBulkDeleteComponent);
    const CategoryResource = createCategoryResource(customDeleteComponent, customBulkDeleteComponent);
    const ProductResource = createProductResource(customDeleteComponent, customBulkDeleteComponent);
    const OrderResource = createOrderResource(customDeleteComponent, customBulkDeleteComponent);
    const OrderItemResource = createOrderItemResource(customDeleteComponent, customBulkDeleteComponent);
    const SettingResource = createSettingResource(customDeleteComponent, customBulkDeleteComponent);

    const app = express();

    // Trust proxy (needed for secure cookies behind reverse proxy)
    if (process.env.NODE_ENV === 'production') {
        app.set('trust proxy', 1);
    }

    // Serve static assets (logo, etc.)
    app.use('/public', express.static(path.join(__dirname, '..', 'public')));

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
        componentLoader,
        branding: {
            companyName: 'eCommerce Admin',
            logo: '/public/logo.svg',
            favicon: '/public/logo.svg',
            softwareBrothers: false,
        },
        locale: {
            language: 'en',
            availableLanguages: ['en'],
        },
        dashboard: {
            handler: getDashboardHandler,
            component: dashboardComponent,
        },
        pages: {
            Settings: {
                handler: getSettingsHandler,
                component: settingsComponent,
                icon: 'Settings',
            },
            MyProfile: {
                handler: async (request, response, context) => {
                    const body = request.fields || request.body || {};
                    const action = body.action || (request.query && request.query.action);
                    if (action === 'update') {
                        request.body = body;
                        return updateProfileHandler(request, response, context);
                    }
                    if (action === 'delete') {
                        return deleteAccountHandler(request, response, context);
                    }
                    return getProfileHandler(request, response, context);
                },
                component: profileComponent,
                icon: 'User',
            },
        },
    });

    // Bundle custom components (required for AdminJS v7)
    if (process.env.NODE_ENV === 'production') {
        await adminJs.initialize();
    } else {
        await adminJs.watch();
    }

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

    // Body parsing middleware (MUST come after AdminJS router)
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // API routes
    app.use('/api', authRoutes);

    // Redirect root to admin panel
    app.get('/', (req, res) => res.redirect('/admin'));

    // Sync database and start server
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        await sequelize.sync({ alter: true });
        console.log('Database synced successfully.');

        // Create session table
        await sessionStore.sync();

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