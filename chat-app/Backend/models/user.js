const { DataTypes } = require('sequelize');
const db = require('../config/db');

const User = db.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = User;
