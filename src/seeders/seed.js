require('dotenv').config();

const bcrypt = require('bcryptjs');
const { sequelize, User, Category, Product, Order, OrderItem, Setting } = require('../models');

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        await sequelize.sync({ force: true });
        console.log('Tables created.');

        // Seed Users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        const userPassword = await bcrypt.hash('user123', salt);

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
        }, { hooks: false });

        const user1 = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: userPassword,
            role: 'user',
        }, { hooks: false });

        const user2 = await User.create({
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: userPassword,
            role: 'user',
        }, { hooks: false });

        console.log('Users seeded.');

        // Seed Categories
        const electronics = await Category.create({ name: 'Electronics', description: 'Electronic devices and gadgets' });
        const clothing = await Category.create({ name: 'Clothing', description: 'Apparel and fashion items' });
        const books = await Category.create({ name: 'Books', description: 'Books and literature' });
        const home = await Category.create({ name: 'Home & Garden', description: 'Home and garden products' });

        console.log('Categories seeded.');

        // Seed Products
        const products = await Product.bulkCreate([
            { name: 'Laptop', description: 'High performance laptop', price: 999.99, stock: 50, categoryId: electronics.id },
            { name: 'Smartphone', description: 'Latest smartphone model', price: 699.99, stock: 100, categoryId: electronics.id },
            { name: 'Headphones', description: 'Wireless noise-cancelling headphones', price: 149.99, stock: 200, categoryId: electronics.id },
            { name: 'T-Shirt', description: 'Cotton crew neck t-shirt', price: 19.99, stock: 500, categoryId: clothing.id },
            { name: 'Jeans', description: 'Classic fit denim jeans', price: 49.99, stock: 300, categoryId: clothing.id },
            { name: 'JavaScript Guide', description: 'Complete guide to JavaScript', price: 39.99, stock: 150, categoryId: books.id },
            { name: 'Node.js Handbook', description: 'Professional Node.js development', price: 34.99, stock: 120, categoryId: books.id },
            { name: 'Desk Lamp', description: 'LED adjustable desk lamp', price: 29.99, stock: 80, categoryId: home.id },
        ]);

        console.log('Products seeded.');

        // Seed Orders
        const order1 = await Order.create({ userId: user1.id, totalAmount: 1149.98, status: 'delivered' });
        const order2 = await Order.create({ userId: user1.id, totalAmount: 69.98, status: 'processing' });
        const order3 = await Order.create({ userId: user2.id, totalAmount: 699.99, status: 'pending' });
        const order4 = await Order.create({ userId: user2.id, totalAmount: 149.99, status: 'shipped' });
        const order5 = await Order.create({ userId: admin.id, totalAmount: 39.99, status: 'delivered' });

        console.log('Orders seeded.');

        // Seed OrderItems
        await OrderItem.bulkCreate([
            { orderId: order1.id, productId: products[0].id, quantity: 1, price: 999.99 },
            { orderId: order1.id, productId: products[2].id, quantity: 1, price: 149.99 },
            { orderId: order2.id, productId: products[3].id, quantity: 2, price: 19.99 },
            { orderId: order2.id, productId: products[4].id, quantity: 1, price: 49.99 },
            { orderId: order3.id, productId: products[1].id, quantity: 1, price: 699.99 },
            { orderId: order4.id, productId: products[2].id, quantity: 1, price: 149.99 },
            { orderId: order5.id, productId: products[5].id, quantity: 1, price: 39.99 },
        ]);

        console.log('OrderItems seeded.');

        // Seed Settings
        await Setting.bulkCreate([
            { key: 'site_name', value: 'eCommerce Store', description: 'Name of the store' },
            { key: 'currency', value: 'USD', description: 'Default currency' },
            { key: 'tax_rate', value: '0.10', description: 'Tax rate percentage' },
            { key: 'shipping_fee', value: '5.99', description: 'Default shipping fee' },
            { key: 'maintenance_mode', value: 'false', description: 'Enable or disable maintenance mode' },
        ]);

        console.log('Settings seeded.');
        console.log('\nSeeding completed successfully!');
        console.log('Admin login: admin@example.com / admin123');
        console.log('User login:  john@example.com / user123');

        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
