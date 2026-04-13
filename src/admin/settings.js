const { Setting } = require('../models/index.js');

/**
 * Handler for the custom Settings page.
 * Supports GET (list all settings) and POST (update a setting).
 */
const getSettingsHandler = async (request, response, context) => {
    const { currentAdmin } = context;

    // Only admins can manage settings
    if (currentAdmin.role !== 'admin') {
        return {
            settings: [],
            error: 'You do not have permission to manage settings.',
        };
    }

    // Handle update action
    if (request.method === 'post' && request.body && request.body.action === 'update') {
        try {
            const { id, value } = request.body;
            const setting = await Setting.findByPk(id);
            if (!setting) {
                return { success: false, error: 'Setting not found.' };
            }
            setting.value = value;
            await setting.save();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    // Default: fetch all settings
    try {
        const settings = await Setting.findAll({ order: [['key', 'ASC']] });
        return {
            settings: settings.map((s) => s.toJSON()),
        };
    } catch (err) {
        return { settings: [], error: err.message };
    }
};

module.exports = { getSettingsHandler };
