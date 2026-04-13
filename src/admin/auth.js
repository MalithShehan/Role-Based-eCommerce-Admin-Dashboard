const bcrypt = require("bcryptjs");
const { User } = require("../models/index.js");

const authenticate = async (email, password) => {
  try {
    if (!email || !password) {
      return null;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      title: user.role === "admin" ? "Administrator" : "User",
      avatarUrl: null,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
};

module.exports = { authenticate };
