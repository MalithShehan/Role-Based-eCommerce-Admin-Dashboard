const { sequelize } = require('../../models/index.js');

/**
 * Resequences IDs for all tables after a delete operation.
 * Disables FK triggers, remaps IDs and FKs, re-enables triggers.
 * Used as an AdminJS delete action `after` hook.
 */
async function resequenceAll() {
    const t = await sequelize.transaction();
    try {
        const tables = ['order_items', 'orders', 'products', 'categories', 'users', 'settings'];
        for (const table of tables) {
            await sequelize.query(`ALTER TABLE ${table} DISABLE TRIGGER ALL;`, { transaction: t });
        }

        // Users → update orders.user_id
        await sequelize.query(`WITH m AS (SELECT id AS old_id, ROW_NUMBER() OVER (ORDER BY id) AS new_id FROM users) UPDATE orders SET user_id = m.new_id FROM m WHERE orders.user_id = m.old_id;`, { transaction: t });
        await sequelize.query(`WITH m AS (SELECT id AS old_id, ROW_NUMBER() OVER (ORDER BY id) AS new_id FROM users) UPDATE users SET id = m.new_id FROM m WHERE users.id = m.old_id;`, { transaction: t });
        await sequelize.query(`SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 0) + 1, false);`, { transaction: t });

        // Categories → update products.category_id
        await sequelize.query(`WITH m AS (SELECT id AS old_id, ROW_NUMBER() OVER (ORDER BY id) AS new_id FROM categories) UPDATE products SET category_id = m.new_id FROM m WHERE products.category_id = m.old_id;`, { transaction: t });
        await sequelize.query(`WITH m AS (SELECT id AS old_id, ROW_NUMBER() OVER (ORDER BY id) AS new_id FROM categories) UPDATE categories SET id = m.new_id FROM m WHERE categories.id = m.old_id;`, { transaction: t });
        await sequelize.query(`SELECT setval('categories_id_seq', COALESCE((SELECT MAX(id) FROM categories), 0) + 1, false);`, { transaction: t });

        // Products → update order_items.product_id
        await sequelize.query(`WITH m AS (SELECT id AS old_id, ROW_NUMBER() OVER (ORDER BY id) AS new_id FROM products) UPDATE order_items SET product_id = m.new_id FROM m WHERE order_items.product_id = m.old_id;`, { transaction: t });
        await sequelize.query(`WITH m AS (SELECT id AS old_id, ROW_NUMBER() OVER (ORDER BY id) AS new_id FROM products) UPDATE products SET id = m.new_id FROM m WHERE products.id = m.old_id;`, { transaction: t });
        await sequelize.query(`SELECT setval('products_id_seq', COALESCE((SELECT MAX(id) FROM products), 0) + 1, false);`, { transaction: t });

        // Orders → update order_items.order_id
        await sequelize.query(`WITH m AS (SELECT id AS old_id, ROW_NUMBER() OVER (ORDER BY id) AS new_id FROM orders) UPDATE order_items SET order_id = m.new_id FROM m WHERE order_items.order_id = m.old_id;`, { transaction: t });
        await sequelize.query(`WITH m AS (SELECT id AS old_id, ROW_NUMBER() OVER (ORDER BY id) AS new_id FROM orders) UPDATE orders SET id = m.new_id FROM m WHERE orders.id = m.old_id;`, { transaction: t });
        await sequelize.query(`SELECT setval('orders_id_seq', COALESCE((SELECT MAX(id) FROM orders), 0) + 1, false);`, { transaction: t });

        // OrderItems (no dependents)
        await sequelize.query(`WITH m AS (SELECT id AS old_id, ROW_NUMBER() OVER (ORDER BY id) AS new_id FROM order_items) UPDATE order_items SET id = m.new_id FROM m WHERE order_items.id = m.old_id;`, { transaction: t });
        await sequelize.query(`SELECT setval('order_items_id_seq', COALESCE((SELECT MAX(id) FROM order_items), 0) + 1, false);`, { transaction: t });

        // Settings (no dependents)
        await sequelize.query(`WITH m AS (SELECT id AS old_id, ROW_NUMBER() OVER (ORDER BY id) AS new_id FROM settings) UPDATE settings SET id = m.new_id FROM m WHERE settings.id = m.old_id;`, { transaction: t });
        await sequelize.query(`SELECT setval('settings_id_seq', COALESCE((SELECT MAX(id) FROM settings), 0) + 1, false);`, { transaction: t });

        for (const table of tables) {
            await sequelize.query(`ALTER TABLE ${table} ENABLE TRIGGER ALL;`, { transaction: t });
        }
        await t.commit();
    } catch (error) {
        await t.rollback();
        console.error('Resequence failed:', error.message);
    }
}

/**
 * AdminJS after-delete hook. Resequences all IDs then forces list redirect.
 */
const afterDeleteResequence = async (response, request, context) => {
    await resequenceAll();
    const resourceId = context.resource.id();
    return {
        ...response,
        redirectUrl: `/admin/resources/${resourceId}`,
        notice: {
            message: 'Record deleted and IDs resequenced successfully',
            type: 'success',
        },
    };
};

module.exports = { resequenceAll, afterDeleteResequence };
