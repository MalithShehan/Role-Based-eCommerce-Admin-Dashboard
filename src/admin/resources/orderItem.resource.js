const { OrderItem } = require("../models");

const OrderItemResource = {
  resource: OrderItem,
  options: {
    navigation: { name: "eCommerce", icon: "Receipt" },
    properties: {
      id: {
        position: 1,
      },
      orderId: {
        position: 2,
      },
      productId: {
        position: 3,
      },
      quantity: {
        position: 4,
      },
      price: {
        position: 5,
      },
    },
    listProperties: [
      "id",
      "orderId",
      "productId",
      "quantity",
      "price",
      "createdAt",
    ],
    showProperties: [
      "id",
      "orderId",
      "productId",
      "quantity",
      "price",
      "createdAt",
      "updatedAt",
    ],
    editProperties: ["orderId", "productId", "quantity", "price"],
    filterProperties: [
      "orderId",
      "productId",
      "quantity",
      "price",
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

module.exports = OrderItemResource;
