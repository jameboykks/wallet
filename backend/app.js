const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/transaction', require('./routes/transaction.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/notification', require('./routes/notification.routes'));

app.get('/', (req, res) => res.send('E-Wallet API running!'));

module.exports = app;
