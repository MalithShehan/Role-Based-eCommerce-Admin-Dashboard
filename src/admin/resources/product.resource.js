const { Product } = require("../../models");

const ProductResource = {
  resource: Product,
  options: {
    navigation: { name: "eCommerce", icon: "ShoppingCart" },
    properties: {
      id: {
        isTitle: false,
        position: 1,
      },
      name: {
        isTitle: true,
        position: 2,
      },
      description: {
        type: "textarea",
        position: 3,
      },
      price: { position: 4 },
      stock: { position: 5 },
      categoryId: {
        position: 6,
        reference: 'categories',
        isVisible: { list: true, show: true, edit: true, filter: true },
      },
    },
    listProperties: ["id", "name", "price", "stock", "categoryId", "createdAt"],
    showProperties: [
      "id",
      "name",
      "description",
      "price",
      "stock",
      "categoryId",
      "createdAt",
      "updatedAt",
    ],
    editProperties: ["name", "description", "price", "stock", "categoryId"],
    filterProperties: [
      "name",
      "price",
      "stock",
      "categoryId",
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

module.exports = ProductResource;
