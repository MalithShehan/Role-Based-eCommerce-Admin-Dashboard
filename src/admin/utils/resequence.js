const { sequelize } = require('../../models/index.js');

// Map PostgreSQL FK action codes to SQL keywords
const FK_ACTIONS = { a: 'NO ACTION', r: 'RESTRICT', c: 'CASCADE', n: 'SET NULL', d: 'SET DEFAULT' };

// Tables in dependency order (parents first) with their FK children
const TABLES = [
    { name: 'users',       children: [{ table: 'orders',      col: 'user_id' }] },
    { name: 'categories',  children: [{ table: 'products',    col: 'category_id' }] },
    { name: 'products',    children: [{ table: 'order_items', col: 'product_id' }] },
    { name: 'orders',      children: [{ table: 'order_items', col: 'order_id' }] },
    { name: 'order_items', children: [] },
    { name: 'settings',    children: [] },
];

/**
 * Resequences IDs for all tables after a delete operation.
 *
 * Strategy (avoids DISABLE TRIGGER ALL which needs superuser):
 *   1. Query and temporarily DROP all FK constraints
 *   2. For each table with gaps:
 *      a. Build old_id → new_id mapping
 *      b. Update child FK columns to new values
 *      c. Two-phase PK update: offset IDs high, then assign sequential
 *      d. Reset the auto-increment sequence
 *   3. Re-add all FK constraints with original ON UPDATE/DELETE actions
 */
async function resequenceAll() {
    const t = await sequelize.transaction();
    try {
        // 1. Discover all FK constraints in our tables
        const [fks] = await sequelize.query(`
            SELECT c.conname   AS name,
                   t.relname   AS "table",
                   a.attname   AS "column",
                   rt.relname  AS "refTable",
                   ra.attname  AS "refColumn",
                   c.confupdtype AS "onU",
                   c.confdeltype AS "onD"
            FROM pg_constraint c
            JOIN pg_class t   ON c.conrelid  = t.oid
            JOIN pg_class rt  ON c.confrelid = rt.oid
            JOIN pg_namespace n ON t.relnamespace = n.oid
            JOIN pg_attribute a  ON a.attnum = ANY(c.conkey)  AND a.attrelid = t.oid
            JOIN pg_attribute ra ON ra.attnum = ANY(c.confkey) AND ra.attrelid = rt.oid
            WHERE c.contype = 'f' AND n.nspname = 'public'
              AND t.relname IN ('orders','products','order_items')
        `, { transaction: t });

        // 2. Drop all FK constraints so we can freely update IDs
        for (const fk of fks) {
            await sequelize.query(
                `ALTER TABLE "${fk.table}" DROP CONSTRAINT "${fk.name}"`,
                { transaction: t }
            );
        }

        // 3. Resequence each table
        for (const { name, children } of TABLES) {
            // Check if table has gaps (count != max id)
            const [[row]] = await sequelize.query(
                `SELECT COUNT(*)::int AS cnt, COALESCE(MAX(id),0)::int AS maxid FROM "${name}"`,
                { transaction: t }
            );
            if (row.cnt === row.maxid) continue; // no gaps, skip

            // Build mapping: old_id → new sequential id
            const tmpMap = `_remap_${name}`;
            await sequelize.query(`DROP TABLE IF EXISTS ${tmpMap}`, { transaction: t });
            await sequelize.query(
                `CREATE TEMP TABLE ${tmpMap} AS
                 SELECT id AS oid, (ROW_NUMBER() OVER (ORDER BY id))::int AS nid FROM "${name}"`,
                { transaction: t }
            );

            // Update FK columns in child tables to new values
            for (const c of children) {
                await sequelize.query(
                    `UPDATE "${c.table}" SET "${c.col}" = m.nid
                     FROM ${tmpMap} m WHERE "${c.table}"."${c.col}" = m.oid`,
                    { transaction: t }
                );
            }

            // Two-phase PK update to avoid uniqueness conflicts:
            // Phase 1: Offset all IDs high (guaranteed unique)
            await sequelize.query(`UPDATE "${name}" SET id = id + 1000000`, { transaction: t });
            // Phase 2: Assign new sequential IDs
            await sequelize.query(
                `UPDATE "${name}" SET id = m.nid FROM ${tmpMap} m WHERE "${name}".id = m.oid + 1000000`,
                { transaction: t }
            );

            // Reset auto-increment sequence
            await sequelize.query(
                `SELECT setval('${name}_id_seq', COALESCE((SELECT MAX(id) FROM "${name}"),0)+1, false)`,
                { transaction: t }
            );

            await sequelize.query(`DROP TABLE IF EXISTS ${tmpMap}`, { transaction: t });
        }

        // 4. Restore all FK constraints with their original actions
        for (const fk of fks) {
            const onUpdate = FK_ACTIONS[fk.onU] || 'CASCADE';
            const onDelete = FK_ACTIONS[fk.onD] || 'SET NULL';
            await sequelize.query(
                `ALTER TABLE "${fk.table}" ADD CONSTRAINT "${fk.name}"
                 FOREIGN KEY ("${fk.column}") REFERENCES "${fk.refTable}"("${fk.refColumn}")
                 ON UPDATE ${onUpdate} ON DELETE ${onDelete}`,
                { transaction: t }
            );
        }

        await t.commit();
    } catch (error) {
        await t.rollback();
        console.error('Resequence error:', error.message);
        throw error;
    }
}

/**
 * AdminJS after-delete hook. Resequences all IDs then forces list refresh.
 */
const afterDeleteResequence = async (response, request, context) => {
    const resourceId = context.resource.id();
    try {
        await resequenceAll();
        return {
            ...response,
            redirectUrl: `/admin/resources/${resourceId}?t=${Date.now()}`,
            notice: { message: 'Record deleted and IDs resequenced successfully', type: 'success' },
        };
    } catch (err) {
        return {
            ...response,
            redirectUrl: `/admin/resources/${resourceId}?t=${Date.now()}`,
            notice: { message: 'Deleted but resequencing failed: ' + err.message, type: 'error' },
        };
    }
};

module.exports = { resequenceAll, afterDeleteResequence };
