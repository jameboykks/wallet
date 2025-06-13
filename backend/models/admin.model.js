const { DataTypes } = require('sequelize');
module.exports = (sequelize) =>
  sequelize.define(
    'Admin',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING(50), unique: true, allowNull: false },
      email: { type: DataTypes.STRING(100), unique: true, allowNull: false },
      password_hash: { type: DataTypes.STRING(255), allowNull: false }
    },
    { tableName: 'Admin', timestamps: true, createdAt: 'created_at', updatedAt: false }
  );
