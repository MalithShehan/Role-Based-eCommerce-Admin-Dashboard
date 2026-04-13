const bcrypt = require('bcryptjs');
const { User } = require('../models/index.js');

const getProfileHandler = async (request, response, context) => {
    const { currentAdmin } = context;

    if (!currentAdmin) {
        return { user: null };
    }

    const user = await User.findByPk(currentAdmin.id, {
        attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
    });

    return { user: user ? user.toJSON() : null };
};

const updateProfileHandler = async (request, response, context) => {
    const { currentAdmin } = context;

    if (!currentAdmin) {
        return { success: false, message: 'Not authenticated' };
    }

    const body = request.fields || request.body || {};
    const { name, email, currentPassword, newPassword } = body;

    try {
        const user = await User.findByPk(currentAdmin.id);
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        // Build update object
        const updates = {};

        if (name && name.trim()) {
            updates.name = name.trim();
        }

        if (email && email.trim()) {
            // Check if email is already taken by another user
            const existing = await User.findOne({ where: { email: email.trim() } });
            if (existing && existing.id !== currentAdmin.id) {
                return { success: false, message: 'Email is already in use' };
            }
            updates.email = email.trim();
        }

        // Password change requires current password verification
        if (newPassword) {
            if (!currentPassword) {
                return { success: false, message: 'Current password is required to set a new password' };
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return { success: false, message: 'Current password is incorrect' };
            }
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(newPassword, salt);
        }

        if (Object.keys(updates).length === 0) {
            return { success: false, message: 'No changes to save' };
        }

        await user.update(updates, { hooks: false });

        const updated = await User.findByPk(currentAdmin.id, {
            attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
        });

        return { success: true, message: 'Profile updated successfully', user: updated.toJSON() };
    } catch (error) {
        return { success: false, message: error.message || 'Failed to update profile' };
    }
};

const deleteAccountHandler = async (request, response, context) => {
    const { currentAdmin } = context;

    if (!currentAdmin) {
        return { success: false, message: 'Not authenticated' };
    }

    try {
        const user = await User.findByPk(currentAdmin.id);
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        await user.destroy();

        return { success: true, message: 'Account deleted successfully' };
    } catch (error) {
        return { success: false, message: error.message || 'Failed to delete account' };
    }
};

module.exports = { getProfileHandler, updateProfileHandler, deleteAccountHandler };
