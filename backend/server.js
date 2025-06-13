const app = require('./app');
const { port } = require('./config');
const { sequelize } = require('./models');

sequelize.sync({ alter: false }).then(() => {
  app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
  });
});
