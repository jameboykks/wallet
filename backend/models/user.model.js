const { DataTypes } = require('sequelize');
module.exports = (sequelize) =>
  sequelize.define(
    'User',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING(50), unique: true, allowNull: false },
      email: { type: DataTypes.STRING(100), unique: true, allowNull: false },
      password_hash: { type: DataTypes.STRING(255), allowNull: false },
      full_name: { type: DataTypes.STRING(100) },
      phone: { type: DataTypes.STRING(20) },
      avatar_url: { type: DataTypes.STRING(255) },
      balance: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0 },
      is_locked: { type: DataTypes.BOOLEAN, defaultValue: false },
      two_fa_enabled: { type: DataTypes.BOOLEAN, defaultValue: false }
    },
    { tableName: 'User', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' }
  );
