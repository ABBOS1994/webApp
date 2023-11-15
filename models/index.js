//models/index.js
require('dotenv').config()
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const db = {};
const basename = path.basename(__filename);

const env = process.env.NODE_ENV || 'development';
const config = env === 'test' ? require('../config/test.config.json')['test'] : require('../config/config.json')['development'];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
// Disable logging during tests
if (process.env.NODE_ENV === 'test') {
  sequelize.options.logging = false;
}
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const modelName = file.split('.')[0];
    db[modelName] = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
