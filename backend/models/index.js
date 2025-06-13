const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    logging: false
  }
);

const User = require('./user.model')(sequelize);
const Admin = require('./admin.model')(sequelize);
const Contact = require('./contact.model')(sequelize);
const Transaction = require('./transaction.model')(sequelize);
const Notification = require('./notification.model')(sequelize);
const OtpCode = require('./otpcode.model')(sequelize);

// Associations
User.hasMany(Contact, { foreignKey: 'user_id', as: 'contacts' });
User.hasMany(Transaction, { foreignKey: 'user_id', as: 'transactions' });
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Contact.belongsTo(User, { foreignKey: 'contact_user_id', as: 'contactUser' });
Transaction.belongsTo(User, { foreignKey: 'related_user_id', as: 'relatedUser' });
OtpCode.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  User,
  Admin,
  Contact,
  Transaction,
  Notification,
  OtpCode
};
