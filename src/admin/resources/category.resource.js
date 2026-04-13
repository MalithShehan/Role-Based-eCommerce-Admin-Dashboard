const { Category } = require("../../models/index.js");
const { afterDeleteResequence } = require("../utils/resequence");

module.exports = (deleteComponent, bulkDeleteComponent) => ({
  resource: Category,
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
        type: "richtext",
        position: 3,
      },
    },
    listProperties: ["id", "name", "description", "createdAt"],
    showProperties: ["id", "name", "description", "createdAt", "updatedAt"],
    editProperties: ["name", "description"],
    filterProperties: ["name", "createdAt", "updatedAt"],

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
