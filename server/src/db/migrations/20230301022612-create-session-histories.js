'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  
     await queryInterface.createTable('session_histories',{ 
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue:Sequelize.UUIDV4,
        },
        user_id: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        active_flag: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue:1
        },
        access_token: {
          type: Sequelize.STRING,
          allowNull: false
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },{
        define: {
          freezeTableName: true
        }
      });
  },

  async down (queryInterface, Sequelize) {
   
    await queryInterface.dropTable('session_histories');
     
  }
};
