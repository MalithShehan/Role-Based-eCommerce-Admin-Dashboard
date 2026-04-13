const { OrderItem } = require("../../models/index.js");
const { afterDeleteResequence } = require("../utils/resequence");

module.exports = (deleteComponent, bulkDeleteComponent) => ({
  resource: OrderItem,
  options: {
    navigation: { name: "eCommerce", icon: "Receipt" },
    properties: {
      id: {
        position: 1,
      },
      orderId: {
        position: 2,
        reference: 'orders',
        isVisible: { list: true, show: true, edit: true, filter: true },
      },
      productId: {
        position: 3,
        reference: 'products',
        isVisible: { list: true, show: true, edit: true, filter: true },
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
        after: afterDeleteResequence,
        component: deleteComponent,
        showInDrawer: true,
        guard: '',
      },
      bulkDelete: {
        isAccessible: ({ currentAdmin }) =>
          currentAdmin && currentAdmin.role === "admin",
        after: afterDeleteResequence,
        component: bulkDeleteComponent,
      },
    },
  },
});
