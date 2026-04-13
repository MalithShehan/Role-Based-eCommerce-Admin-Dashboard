require('dotenv').config();
const { sequelize } = require('../models/index.js');

/**
 * Re-sequences IDs for all tables to remove gaps after deletions.
 * Handles foreign key references properly.
 */
async function resequence() {
    const t = await sequelize.transaction();

    try {
        // Disable FK triggers on all tables
        const tables = ['order_items', 'orders', 'products', 'categories', 'users', 'settings'];
        for (const table of tables) {
            await sequelize.query(`ALTER TABLE ${table} DISABLE TRIGGER ALL;`, { transaction: t });
        }

        // 1. Re-sequence Users
        console.log('Re-sequencing Users...');
        await sequelize.query(`
            WITH mapping AS (
                SELECT id AS old_id, ROW_NUMBER() OVER (ORDER BY id) AS new_id FROM users
            )
            UPDATE orders SET user_id = m.new_id
            FROM mapping m WHERE orders.user_id = m.old_id;
        `, { transaction: t });
        await sequelize.query(`
            WITH mapping AS (
                SELECT id AS old_id, ROW_NUMBER() OVER (ORDER BY id) AS new_id FROM users
            )
            UPDATE users SET id = m.new_id
            FROM mapping m WHERE users.id = m.old_id;
        `, { transaction: t });
        await sequelize.query(`SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 0) + 1, false);`, { transaction: t });

        // 2. Re-sequence Categories
        console.log('Re-sequencing Categories...');
        await sequelize.query(`
            WITH mapping AS (
                SELECT id AS old_id, ROW_NUMBER() OVER (ORDER BY id) AS new_id FROM categories
            )
            UPDATE products SET category_id = m.new_id
            FROM mapping m WHERE products.category_id = m.old_id;
        `, { transaction: t });
        await sequelize.query(`
            WITH mapping AS (
                SELECT id AS old_id, ROW_NUMBER() OVER (ORDER BY id) AS new_id FROM categories
            )
            UPDATE categories SET id = m.new_id
            FROM mapping m WHERE categories.id = m.old_id;
        `, { transaction: t });
        await sequelize.query(`SELECT setval('categories_id_seq', COALESCE((SELECT MAX(id) FROM categories), 0) + 1, false);`, { transaction: t });

        // 3. Re-sequence Products
        console.log('Re-sequencing Products...');
        await sequelize.query(`
            WITH mapping AS (
                SELECT id AS old_id, ROW_NUMBER() OVER (ORDER BY id) AS new_id FROM products
            )
            UPDATE order_items SET product_id = m.new_id
            FROM mapping m WHERE order_items.product_id = m.old_id;
        `, { transaction: t });
        await sequelize.query(`
            WITH mapping AS (
                SELECT id AS old_id, ROW_NUMBER() OVER (ORDER BY id) AS new_id FROM products
            )
            UPDATE products SET id = m.new_id
            FROM mapping m WHERE products.id = m.old_id;
        `, { transaction: t });
        await sequelize.query(`SELECT setval('products_id_seq', COALESCE((SELECT MAX(id) FROM products), 0) + 1, false);`, { transaction: t });

        // 4. Re-sequence Orders
        console.log('Re-sequencing Orders...');
        await sequelize.query(`
            WITH mapping AS (
                SELECT id AS old_id, ROW_NUMBER() OVER (ORDER BY id) AS new_id FROM orders
            )
            UPDATE order_items SET order_id = m.new_id
            FROM mapping m WHERE order_items.order_id = m.old_id;
        `, { transaction: t });
        await sequelize.query(`
            WITH mapping AS (
                SELECT id AS old_id, ROW_NUMBER() OVER (ORDER BY id) AS new_id FROM orders
            )
            UPDATE orders SET id = m.new_id
            FROM mapping m WHERE orders.id = m.old_id;
        `, { transaction: t });
        await sequelize.query(`SELECT setval('orders_id_seq', COALESCE((SELECT MAX(id) FROM orders), 0) + 1, false);`, { transaction: t });

        // 5. Re-sequence OrderItems
        console.log('Re-sequencing OrderItems...');
        await sequelize.query(`
            WITH mapping AS (
                SELECT id AS old_id, ROW_NUMBER() OVER (ORDER BY id) AS new_id FROM order_items
            )
            UPDATE order_items SET id = m.new_id
            FROM mapping m WHERE order_items.id = m.old_id;
        `, { transaction: t });
        await sequelize.query(`SELECT setval('order_items_id_seq', COALESCE((SELECT MAX(id) FROM order_items), 0) + 1, false);`, { transaction: t });

        // 6. Re-sequence Settings
        console.log('Re-sequencing Settings...');
        await sequelize.query(`
            WITH mapping AS (
                SELECT id AS old_id, ROW_NUMBER() OVER (ORDER BY id) AS new_id FROM settings
            )
            UPDATE settings SET id = m.new_id
            FROM mapping m WHERE settings.id = m.old_id;
        `, { transaction: t });
        await sequelize.query(`SELECT setval('settings_id_seq', COALESCE((SELECT MAX(id) FROM settings), 0) + 1, false);`, { transaction: t });

        // Re-enable FK triggers
        for (const table of tables) {
            await sequelize.query(`ALTER TABLE ${table} ENABLE TRIGGER ALL;`, { transaction: t });
        }

        await t.commit();
        console.log('\nAll tables re-sequenced successfully!');

        // Show results
        const allTables = ['users', 'categories', 'products', 'orders', 'order_items', 'settings'];
        for (const table of allTables) {
            const [rows] = await sequelize.query(`SELECT id FROM ${table} ORDER BY id`);
            const ids = rows.map(r => r.id).join(', ');
            console.log(`  ${table}: [${ids}]`);
        }
    } catch (error) {
        await t.rollback();
        console.error('Re-sequence failed (rolled back):', error.message);
    } finally {
        await sequelize.close();
    }
}

resequence();
