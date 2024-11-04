'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const { Umzug, SequelizeStorage } = require('umzug');
require('dotenv').config();
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/db.js')[env];
const db = {};
const options = {
  ...config,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    // freezeTableName: true,
  },
};
let sequelize;
if (options.use_env_variable) {
  sequelize = new Sequelize(process.env[options.use_env_variable], options);
} else {
  sequelize = new Sequelize(options.database, options.username, options.password, options);
}

const runMigrations = async () => {
  const umzug = new Umzug({
    migrations: { glob: 'src/db/migrations/*.js' },
    storage: new SequelizeStorage({ sequelize }),
    context: sequelize.getQueryInterface(),
    logger: console,
  });

  console.log("umug==========")
  console.log(umzug)

  // Run migrations if there are any pending
  await umzug.up();
};

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to PostgreSQL has been established successfully.');

    // Run migrations
    await runMigrations();
    console.log('Migrations completed.');

    // Your app's main code here

  } catch (error) {
    console.error('Unable to connect to the database or run migrations:', error);
  }
})


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
