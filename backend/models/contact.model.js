const { DataTypes } = require('sequelize');
module.exports = (sequelize) =>
  sequelize.define(
    'Contact',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      contact_user_id: { type: DataTypes.INTEGER, allowNull: false },
      nickname: { type: DataTypes.STRING(100) }
    },
    { tableName: 'Contact', timestamps: false }
  );
