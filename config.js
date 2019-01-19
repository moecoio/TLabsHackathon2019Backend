
const Sequelize = require('sequelize');

module.exports = {
  server: {
    host: '0.0.0.0',
    port: 3030
  },
  tmpDir: '/opt/TLabsHackathon2019Backend/tmp',
  db: {
    username: 'root',
    password: null,
    database: 'localBD',
    host: '127.0.0.1',
    dialect: 'sqlite',
    dialectOptions: {
      multipleStatements: true
    },
    logging:false,
    storage: './db/localDB.db',
    operatorsAliases: Sequelize.Op
  }
};
