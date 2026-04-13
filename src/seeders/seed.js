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

        const user3 = await User.create({
            name: 'Bob Wilson',
            email: 'bob@example.com',
            password: userPassword,
            role: 'user',
        }, { hooks: false });

        const user4 = await User.create({
            name: 'Alice Brown',
            email: 'alice@example.com',
            password: userPassword,
            role: 'user',
        }, { hooks: false });

        const user5 = await User.create({
            name: 'Charlie Davis',
            email: 'charlie@example.com',
            password: userPassword,
            role: 'user',
        }, { hooks: false });

        const admin2 = await User.create({
            name: 'Sarah Admin',
            email: 'sarah@example.com',
            password: hashedPassword,
            role: 'admin',
        }, { hooks: false });

        const user6 = await User.create({
            name: 'Mike Johnson',
            email: 'mike@example.com',
            password: userPassword,
            role: 'user',
        }, { hooks: false });

        const user7 = await User.create({
            name: 'Emily Clark',
            email: 'emily@example.com',
            password: userPassword,
            role: 'user',
        }, { hooks: false });

        console.log('Users seeded.');

        // Seed Categories
        const electronics = await Category.create({ name: 'Electronics', description: 'Electronic devices and gadgets' });
        const clothing = await Category.create({ name: 'Clothing', description: 'Apparel and fashion items' });
        const books = await Category.create({ name: 'Books', description: 'Books and literature' });
        const home = await Category.create({ name: 'Home & Garden', description: 'Home and garden products' });
        const sports = await Category.create({ name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear' });
        const toys = await Category.create({ name: 'Toys & Games', description: 'Toys, games, and entertainment' });
        const beauty = await Category.create({ name: 'Beauty & Health', description: 'Beauty products and health supplements' });
        const automotive = await Category.create({ name: 'Automotive', description: 'Car parts and accessories' });

        console.log('Categories seeded.');

        // Seed Products
        const products = await Product.bulkCreate([
            // Electronics
            { name: 'Laptop', description: 'High performance laptop with 16GB RAM', price: 999.99, stock: 50, categoryId: electronics.id },
            { name: 'Smartphone', description: 'Latest smartphone model with OLED display', price: 699.99, stock: 100, categoryId: electronics.id },
            { name: 'Headphones', description: 'Wireless noise-cancelling headphones', price: 149.99, stock: 200, categoryId: electronics.id },
            { name: 'Tablet', description: '10-inch tablet with retina display', price: 449.99, stock: 75, categoryId: electronics.id },
            { name: 'Smart Watch', description: 'Fitness tracking smartwatch with GPS', price: 249.99, stock: 120, categoryId: electronics.id },
            { name: 'Wireless Speaker', description: 'Portable Bluetooth speaker with 20hr battery', price: 79.99, stock: 180, categoryId: electronics.id },
            { name: 'Webcam HD', description: '1080p HD webcam for streaming', price: 59.99, stock: 150, categoryId: electronics.id },
            { name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard with Cherry MX switches', price: 129.99, stock: 90, categoryId: electronics.id },
            // Clothing
            { name: 'T-Shirt', description: 'Cotton crew neck t-shirt', price: 19.99, stock: 500, categoryId: clothing.id },
            { name: 'Jeans', description: 'Classic fit denim jeans', price: 49.99, stock: 300, categoryId: clothing.id },
            { name: 'Hoodie', description: 'Fleece pullover hoodie', price: 39.99, stock: 250, categoryId: clothing.id },
            { name: 'Sneakers', description: 'Lightweight running sneakers', price: 89.99, stock: 200, categoryId: clothing.id },
            { name: 'Winter Jacket', description: 'Insulated waterproof winter jacket', price: 129.99, stock: 100, categoryId: clothing.id },
            { name: 'Dress Shirt', description: 'Slim fit cotton dress shirt', price: 34.99, stock: 180, categoryId: clothing.id },
            // Books
            { name: 'JavaScript Guide', description: 'Complete guide to JavaScript', price: 39.99, stock: 150, categoryId: books.id },
            { name: 'Node.js Handbook', description: 'Professional Node.js development', price: 34.99, stock: 120, categoryId: books.id },
            { name: 'Python Crash Course', description: 'Hands-on introduction to Python programming', price: 29.99, stock: 200, categoryId: books.id },
            { name: 'Clean Code', description: 'A handbook of agile software craftsmanship', price: 44.99, stock: 90, categoryId: books.id },
            { name: 'Design Patterns', description: 'Elements of reusable object-oriented software', price: 49.99, stock: 70, categoryId: books.id },
            // Home & Garden
            { name: 'Desk Lamp', description: 'LED adjustable desk lamp', price: 29.99, stock: 80, categoryId: home.id },
            { name: 'Coffee Maker', description: 'Programmable 12-cup coffee maker', price: 69.99, stock: 60, categoryId: home.id },
            { name: 'Plant Pot Set', description: 'Set of 3 ceramic plant pots', price: 24.99, stock: 140, categoryId: home.id },
            { name: 'Throw Blanket', description: 'Soft knitted throw blanket', price: 34.99, stock: 110, categoryId: home.id },
            { name: 'Wall Clock', description: 'Modern minimalist wall clock', price: 19.99, stock: 95, categoryId: home.id },
            // Sports & Outdoors
            { name: 'Yoga Mat', description: 'Non-slip exercise yoga mat', price: 24.99, stock: 300, categoryId: sports.id },
            { name: 'Dumbbell Set', description: 'Adjustable dumbbell set 5-25 lbs', price: 149.99, stock: 50, categoryId: sports.id },
            { name: 'Camping Tent', description: '4-person waterproof camping tent', price: 199.99, stock: 40, categoryId: sports.id },
            { name: 'Running Shoes', description: 'Trail running shoes with grip sole', price: 109.99, stock: 160, categoryId: sports.id },
            { name: 'Water Bottle', description: 'Insulated stainless steel water bottle', price: 14.99, stock: 400, categoryId: sports.id },
            // Toys & Games
            { name: 'Board Game Collection', description: 'Classic board game set with 10 games', price: 34.99, stock: 80, categoryId: toys.id },
            { name: 'LEGO City Set', description: '500-piece LEGO city building set', price: 59.99, stock: 65, categoryId: toys.id },
            { name: 'RC Car', description: 'Remote control off-road car', price: 44.99, stock: 90, categoryId: toys.id },
            { name: 'Puzzle 1000pc', description: '1000-piece landscape jigsaw puzzle', price: 16.99, stock: 120, categoryId: toys.id },
            // Beauty & Health
            { name: 'Skincare Set', description: 'Complete daily skincare routine kit', price: 54.99, stock: 70, categoryId: beauty.id },
            { name: 'Electric Toothbrush', description: 'Sonic electric toothbrush with 3 modes', price: 39.99, stock: 110, categoryId: beauty.id },
            { name: 'Vitamin C Serum', description: 'Anti-aging vitamin C face serum', price: 22.99, stock: 200, categoryId: beauty.id },
            { name: 'Hair Dryer', description: 'Ionic hair dryer with diffuser', price: 49.99, stock: 85, categoryId: beauty.id },
            // Automotive
            { name: 'Car Phone Mount', description: 'Magnetic dashboard phone mount', price: 14.99, stock: 250, categoryId: automotive.id },
            { name: 'Dash Cam', description: '1080p front and rear dash camera', price: 89.99, stock: 60, categoryId: automotive.id },
            { name: 'Car Vacuum', description: 'Portable handheld car vacuum cleaner', price: 34.99, stock: 100, categoryId: automotive.id },
            { name: 'Seat Covers', description: 'Universal fit car seat cover set', price: 44.99, stock: 75, categoryId: automotive.id },
        ]);

        console.log('Products seeded.');

        // Seed Orders
        const order1 = await Order.create({ userId: user1.id, totalAmount: 1149.98, status: 'delivered' });
        const order2 = await Order.create({ userId: user1.id, totalAmount: 69.98, status: 'processing' });
        const order3 = await Order.create({ userId: user2.id, totalAmount: 699.99, status: 'pending' });
        const order4 = await Order.create({ userId: user2.id, totalAmount: 149.99, status: 'shipped' });
        const order5 = await Order.create({ userId: admin.id, totalAmount: 39.99, status: 'delivered' });
        const order6 = await Order.create({ userId: user3.id, totalAmount: 539.97, status: 'delivered' });
        const order7 = await Order.create({ userId: user3.id, totalAmount: 174.98, status: 'processing' });
        const order8 = await Order.create({ userId: user4.id, totalAmount: 299.98, status: 'shipped' });
        const order9 = await Order.create({ userId: user4.id, totalAmount: 89.99, status: 'pending' });
        const order10 = await Order.create({ userId: user5.id, totalAmount: 449.99, status: 'delivered' });
        const order11 = await Order.create({ userId: user5.id, totalAmount: 94.98, status: 'cancelled' });
        const order12 = await Order.create({ userId: user6.id, totalAmount: 199.99, status: 'shipped' });
        const order13 = await Order.create({ userId: user6.id, totalAmount: 54.99, status: 'processing' });
        const order14 = await Order.create({ userId: user7.id, totalAmount: 159.98, status: 'delivered' });
        const order15 = await Order.create({ userId: user7.id, totalAmount: 249.99, status: 'pending' });
        const order16 = await Order.create({ userId: user1.id, totalAmount: 129.99, status: 'delivered' });
        const order17 = await Order.create({ userId: user2.id, totalAmount: 44.99, status: 'processing' });
        const order18 = await Order.create({ userId: admin2.id, totalAmount: 79.99, status: 'delivered' });

        console.log('Orders seeded.');

        // Seed OrderItems
        await OrderItem.bulkCreate([
            // Order 1 - John: Laptop + Headphones
            { orderId: order1.id, productId: products[0].id, quantity: 1, price: 999.99 },
            { orderId: order1.id, productId: products[2].id, quantity: 1, price: 149.99 },
            // Order 2 - John: T-Shirt x2 + Jeans
            { orderId: order2.id, productId: products[8].id, quantity: 2, price: 19.99 },
            { orderId: order2.id, productId: products[9].id, quantity: 1, price: 49.99 },
            // Order 3 - Jane: Smartphone
            { orderId: order3.id, productId: products[1].id, quantity: 1, price: 699.99 },
            // Order 4 - Jane: Headphones
            { orderId: order4.id, productId: products[2].id, quantity: 1, price: 149.99 },
            // Order 5 - Admin: JavaScript Guide
            { orderId: order5.id, productId: products[14].id, quantity: 1, price: 39.99 },
            // Order 6 - Bob: Tablet + Sneakers
            { orderId: order6.id, productId: products[3].id, quantity: 1, price: 449.99 },
            { orderId: order6.id, productId: products[11].id, quantity: 1, price: 89.99 },
            // Order 7 - Bob: Yoga Mat + Dumbbell Set
            { orderId: order7.id, productId: products[24].id, quantity: 1, price: 24.99 },
            { orderId: order7.id, productId: products[25].id, quantity: 1, price: 149.99 },
            // Order 8 - Alice: Smart Watch + Jeans
            { orderId: order8.id, productId: products[4].id, quantity: 1, price: 249.99 },
            { orderId: order8.id, productId: products[9].id, quantity: 1, price: 49.99 },
            // Order 9 - Alice: Sneakers
            { orderId: order9.id, productId: products[11].id, quantity: 1, price: 89.99 },
            // Order 10 - Charlie: Tablet
            { orderId: order10.id, productId: products[3].id, quantity: 1, price: 449.99 },
            // Order 11 - Charlie: Coffee Maker + Plant Pot Set (cancelled)
            { orderId: order11.id, productId: products[20].id, quantity: 1, price: 69.99 },
            { orderId: order11.id, productId: products[21].id, quantity: 1, price: 24.99 },
            // Order 12 - Mike: Camping Tent
            { orderId: order12.id, productId: products[26].id, quantity: 1, price: 199.99 },
            // Order 13 - Mike: Skincare Set
            { orderId: order13.id, productId: products[33].id, quantity: 1, price: 54.99 },
            // Order 14 - Emily: Hoodie + Mechanical Keyboard
            { orderId: order14.id, productId: products[10].id, quantity: 1, price: 39.99 },
            { orderId: order14.id, productId: products[7].id, quantity: 1, price: 129.99 },
            // Order 15 - Emily: Smart Watch
            { orderId: order15.id, productId: products[4].id, quantity: 1, price: 249.99 },
            // Order 16 - John: Winter Jacket
            { orderId: order16.id, productId: products[12].id, quantity: 1, price: 129.99 },
            // Order 17 - Jane: RC Car
            { orderId: order17.id, productId: products[31].id, quantity: 1, price: 44.99 },
            // Order 18 - Sarah Admin: Wireless Speaker
            { orderId: order18.id, productId: products[5].id, quantity: 1, price: 79.99 },
        ]);

        console.log('OrderItems seeded.');

        // Seed Settings
        await Setting.bulkCreate([
            { key: 'site_name', value: 'eCommerce Store', description: 'Name of the store' },
            { key: 'currency', value: 'USD', description: 'Default currency' },
            { key: 'tax_rate', value: '0.10', description: 'Tax rate percentage' },
            { key: 'shipping_fee', value: '5.99', description: 'Default shipping fee' },
            { key: 'maintenance_mode', value: 'false', description: 'Enable or disable maintenance mode' },
            { key: 'items_per_page', value: '20', description: 'Number of items displayed per page' },
            { key: 'contact_email', value: 'support@ecommerce.com', description: 'Store contact email' },
            { key: 'free_shipping_threshold', value: '50.00', description: 'Minimum order amount for free shipping' },
            { key: 'max_order_quantity', value: '10', description: 'Maximum quantity per product per order' },
            { key: 'return_policy_days', value: '30', description: 'Number of days allowed for returns' },
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
