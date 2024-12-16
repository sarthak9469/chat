const { DataTypes } = require('sequelize');
const db = require('../config/db');
const User = require('./user');

const Chat = db.define('Chat', {
  user1_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user2_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Chat.belongsTo(User, { foreignKey: 'user1_id' });
Chat.belongsTo(User, { foreignKey: 'user2_id' });

module.exports = Chat;
