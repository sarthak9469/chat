const { DataTypes } = require('sequelize');
const db = require('../config/db');
const Chat = require('./chat');

const Message = db.define('Message', {
  chat_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Message.belongsTo(Chat, { foreignKey: 'chat_id' });

module.exports = Message;
