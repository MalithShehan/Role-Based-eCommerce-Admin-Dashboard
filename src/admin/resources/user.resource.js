const { User } = require("../../models/index.js");
const { afterDeleteResequence } = require("../utils/resequence");

const isAdmin = ({ currentAdmin }) =>
  currentAdmin && currentAdmin.role === "admin";

module.exports = (deleteComponent, bulkDeleteComponent) => ({
  resource: User,
  options: {
    navigation: { name: "Administration", icon: "Shield" },
    isVisible: isAdmin,
    properties: {
      password: {
        type: 'password',
        isVisible: {
          list: false,
          show: false,
          edit: true,
          filter: false,
        },
        position: 4,
      },
      role: {
        availableValues: [
          { value: "admin", label: "Admin" },
          { value: "user", label: "User" },
        ],
      },
      id: {
        isTitle: false,
        position: 1,
      },
      name: {
        isTitle: true,
        position: 2,
      },
      email: {
        position: 3,
      },
    },
    listProperties: ["id", "name", "email", "role", "createdAt"],
    showProperties: ["id", "name", "email", "role", "createdAt", "updatedAt"],
    editProperties: ["name", "email", "password", "role"],
    filterProperties: ["name", "email", "role", "createdAt", "updatedAt"],
    actions: {
      list: {
        isAccessible: isAdmin,
      },
      show: {
        isAccessible: isAdmin,
      },
      new: {
        isAccessible: isAdmin,
      },
      edit: {
        isAccessible: isAdmin,
        before: async (request) => {
          if (request.payload && !request.payload.password) {
            delete request.payload.password;
          }
          return request;
        },
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
    },
  },
});
