const { DataTypes } = require('sequelize');
module.exports = (sequelize) =>
  sequelize.define(
    'Notification',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      type: { type: DataTypes.ENUM('deposit', 'transfer', 'receive', 'system'), allowNull: false },
      message: { type: DataTypes.STRING(255), allowNull: false },
      is_read: { type: DataTypes.BOOLEAN, defaultValue: false }
    },
    { tableName: 'Notification', timestamps: true, createdAt: 'created_at', updatedAt: false }
  );
