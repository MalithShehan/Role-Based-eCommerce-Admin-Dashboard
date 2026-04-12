const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: {
                    args: [0],
                    msg: "Total amount must be a positive number",
                },
            },
        },
        status: {
            type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending',
        },
    }, {
        tableName: 'orders',
        timestamps: true,
    });
    return Order;
};