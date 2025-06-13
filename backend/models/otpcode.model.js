const { DataTypes } = require('sequelize');
module.exports = (sequelize) =>
  sequelize.define(
    'OtpCode',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      code: { type: DataTypes.STRING(10), allowNull: false },
      expires_at: { type: DataTypes.DATE, allowNull: false }
    },
    { tableName: 'OtpCode', timestamps: true, createdAt: 'created_at', updatedAt: false }
  );
