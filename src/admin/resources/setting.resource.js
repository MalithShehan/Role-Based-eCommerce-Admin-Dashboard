const { Setting } = require("../../models/index.js");
const { afterDeleteResequence } = require("../utils/resequence");

const isAdmin = ({ currentAdmin }) => currentAdmin && currentAdmin.role === "admin";

module.exports = (deleteComponent, bulkDeleteComponent) => ({
  resource: Setting,
  options: {
    navigation: { name: "Administration", icon: "Shield" },
    isVisible: isAdmin,
    properties: {
      id: {
        position: 1,
      },
      key: {
        isTitle: true,
        position: 2,
      },
      value: {
        position: 3,
      },
      description: {
        type: "textarea",
        position: 4,
      },
    },
    listProperties: ["id", "key", "value", "description", "updatedAt"],
    showProperties: [
      "id",
      "key",
      "value",
      "description",
      "createdAt",
      "updatedAt",
    ],
    editProperties: ["key", "value", "description"],
    filterProperties: ["key", "updatedAt", "createdAt"],
    actions: {
      list: {
        isAccessible: isAdmin,
      },
      show: {
        isAccessible: isAdmin,
      },
      edit: {
        isAccessible: isAdmin,
      },
      delete: {
        isAccessible: isAdmin,
        after: afterDeleteResequence,
        component: deleteComponent,
        showInDrawer: true,
        guard: '',
      },
      bulkDelete: {
        isAccessible: isAdmin,
        after: afterDeleteResequence,
        component: bulkDeleteComponent,
      },
      new: {
        isAccessible: isAdmin,
      },
    },
  },
});
