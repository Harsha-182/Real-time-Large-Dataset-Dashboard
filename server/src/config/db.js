require('dotenv').config();

module.exports = {
  development: {
    username: 'default',
    password: '1FymIxRP9aEc',
    database: 'verceldb',
    host: 'ep-bold-meadow-a4zutpbb-pooler.us-east-1.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    seederStorage: 'sequelize',
    seederStorageTableName: 'sequelize_seed_data',
    logging: false,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Only use `false` for development; set `true` for production
      }
    }
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    seederStorage: 'sequelize',
    seederStorageTableName: 'sequelize_seed_data',
    logging: false,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    seederStorage: 'sequelize',
    seederStorageTableName: 'sequelize_seed_data',
    logging: false,
  },
};
