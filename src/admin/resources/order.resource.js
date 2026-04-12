const { Order } = require("../../models");

const OrderResource = {
  resource: Order,
  options: {
    navigation: { name: "eCommerce", icon: "Receipt" },
    properties: {
      id: {
        isTitle: true,
        position: 1,
      },
      userId: {
        position: 2,
        reference: 'users',
        isVisible: { list: true, show: true, edit: true, filter: true },
      },
      totalAmount: {
        position: 3,
      },
      status: {
        position: 4,
        availableValues: [
          { value: "pending", label: "Pending" },
          { value: "processing", label: "Processing" },
          { value: "shipped", label: "Shipped" },
          { value: "delivered", label: "Delivered" },
          { value: "cancelled", label: "Cancelled" },
        ],
      },
    },
    listProperties: ["id", "userId", "totalAmount", "status", "createdAt"],
    showProperties: [
      "id",
      "userId",
      "totalAmount",
      "status",
      "createdAt",
      "updatedAt",
    ],
    editProperties: ["userId", "totalAmount", "status"],
    filterProperties: [
      "userId",
      "status",
      "totalAmount",
      "createdAt",
      "updatedAt",
    ],
    actions: {
      list: {
        isAccessible: true,
      },
      show: {
        isAccessible: true,
      },
      new: {
        isAccessible: ({ currentAdmin }) =>
          currentAdmin && currentAdmin.role === "admin",
      },
      edit: {
        isAccessible: ({ currentAdmin }) =>
          currentAdmin && currentAdmin.role === "admin",
      },
      delete: {
        isAccessible: ({ currentAdmin }) =>
          currentAdmin && currentAdmin.role === "admin",
      },
    },
  },
};

module.exports = OrderResource;
