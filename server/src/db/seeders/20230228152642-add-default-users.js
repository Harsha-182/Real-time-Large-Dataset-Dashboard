'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await queryInterface.bulkInsert('users', [{
        id: uuidv4(),
        email: 'test1@celestialsys.com',
        first_name: 'Test',
        last_name: 'user1',
        role: 'super-admin',
        created_at: new Date(),
        updated_at: new Date(),
      }]);
      const User = await queryInterface.sequelize
        .query("SELECT * FROM users where email='test1@celestialsys.com' LIMIT 1");
      await queryInterface.bulkInsert('credentials', [{
        id: uuidv4(),
        password: '$2b$10$m/NN2SJvdqfRSr8dfE7hRuSpbrorG0rLmwqJ.khAsyYHO1.5djAQm', //admin@123
        user_id: User[0][0].id,
        created_at: new Date(),
        updated_at: new Date(),
      }]);
    } catch (error) {
      console.log(error);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
