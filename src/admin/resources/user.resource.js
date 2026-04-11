const { User } = require("../../models");

const isAdmin = ({ currentAdmin }) =>
  currentAdmin && currentAdmin.role === "admin";

const UserResource = {
  resource: User,
  options: {
    navigation: { name: "Administration", icon: "Shield" },
    isVisible: isAdmin,
    properties: {
      password: {
        isVisible: {
          list: false,
          show: false,
          edit: false,
          filter: false,
        },
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
    editProperties: ["name", "email", "role"],
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
      },
      delete: {
        isAccessible: isAdmin,
      },
    },
  },
};

module.exports = UserResource;
