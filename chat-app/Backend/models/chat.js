const { DataTypes } = require('sequelize');
const db = require('../config/db');
const User = require('./user');

const Chat = db.define('Chat', {
  id: {
    type: DataTypes.STRING, 
    primaryKey: true,
  },
  user1_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user2_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Chat.belongsTo(User, { foreignKey: 'user1_id', as: 'user1' });
Chat.belongsTo(User, { foreignKey: 'user2_id', as: 'user2' });

module.exports = Chat;
