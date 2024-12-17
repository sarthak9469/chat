const { DataTypes } = require('sequelize');
const db = require('../config/db');

const User = db.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

// User.hasMany(Chat, { foreignKey: 'user1_id' });
// User.hasMany(Chat, { foreignKey: 'user2_id' });

module.exports = User;
