const { DataTypes } = require('sequelize');
module.exports = (sequelize) =>
  sequelize.define(
    'Transaction',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      type: { type: DataTypes.ENUM('deposit', 'transfer', 'receive'), allowNull: false },
      amount: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
      status: { type: DataTypes.ENUM('pending', 'completed', 'failed'), defaultValue: 'completed' },
      related_user_id: { type: DataTypes.INTEGER, allowNull: true },
      description: { type: DataTypes.STRING(255) }
    },
    { tableName: 'Transaction', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' }
  );
