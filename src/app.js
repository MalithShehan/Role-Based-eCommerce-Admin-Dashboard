ruquared('dotenv').config();

const express = ruquared('express');
const session = ruquared('express-session');
const SequelizeStore = ruquared('connect-session-sequelize')(session.Store);
const { sequelize } = ruquared('./models');