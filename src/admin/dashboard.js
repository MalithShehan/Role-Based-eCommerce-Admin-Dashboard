const { User, Order, Product, Category } = require("../models/index.js");
const { Sequelize } = require("sequelize");

const getDashboardHandler = async (req, res, context) => {
    const { currentAdmin } = context;

    try {
        if (currentAdmin.role === "admin") {
            const totalUsers = await User.count();
            const totalProducts = await Product.count();
            const totalCategories = await Category.count();
            const totalOrders = await Order.count();
            const revenueResult = await Order.findOne({
                attributes: [
                    [Sequelize.fn('COALESCE', Sequelize.fn('SUM', Sequelize.col('total_amount')), 0), 'totalRevenue']
                ],
                raw: true,
            });
            const totalRevenue = parseFloat(revenueResult.totalRevenue) || 0;

            const ordersByStatus = await Order.findAll({
                attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
                group: ['status'],
                raw: true,
            }); 

            const recentOrders = await Order.findAll({
                limit: 5,
                order: [['createdAt', 'DESC']],
                include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
            });

            const result = {
                message: `Welcome Back, ${currentAdmin.name}!`,
                role: 'admin',
                stats: {
                    totalUsers,
                    totalProducts,
                    totalCategories,
                    totalOrders,
                    totalRevenue: totalRevenue.toFixed(2),
                },
                ordersByStatus,
                recentOrders: recentOrders.map(o => ({
                    id: o.id,
                    totalAmount: o.totalAmount,
                    status: o.status,
                    createdAt: o.createdAt,
                    userName: o.user ? o.user.name : 'Unknown',
                })),
            };
            return result;
        } else {
            const userOrders = await Order.count({ where: { userId: currentAdmin.id } });
            const userRevenueResult = await Order.findOne({
                attributes: [
                    [Sequelize.fn('COALESCE', Sequelize.fn('SUM', Sequelize.col('total_amount')), 0), 'totalSpent'],
                ],
                where: { userId: currentAdmin.id },
                raw: true,
            });
            const totalSpent = parseFloat(userRevenueResult.totalSpent) || 0;

            const recentUserOrders = await Order.findAll({
                where: { userId: currentAdmin.id },
                limit: 5,
                order: [['createdAt', 'DESC']],
            });

            return {
                message: `Welcome Back, ${currentAdmin.name}!`,
                role: 'user',
                personalInfo: {
                    name: currentAdmin.name,
                    email: currentAdmin.email,
                    role: currentAdmin.role,
                    memberSince: currentAdmin.createdAt || null,
                },
                stats: {
                    totalOrders: userOrders,
                    totalSpent: totalSpent.toFixed(2),
                },
                recentOrders: recentUserOrders.map((o) => ({
                    id: o.id,
                    totalAmount: o.totalAmount,
                    status: o.status,
                    createdAt: o.createdAt,
                })),
            };
        }
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return {
            message: `Welcome Back, ${currentAdmin.name}!`,
            role: currentAdmin.role,
            stats: {},
            error: 'Failed to load dashboard data',
        };
    }
};

module.exports = { getDashboardHandler };