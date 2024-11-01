'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('taxi_trips', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue:Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      vendor_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tpep_pickup_datetime: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tpep_dropoff_datetime: {
        type: Sequelize.STRING,
        allowNull: false
      },
      passenger_count: {
        type: Sequelize.STRING,
        allowNull: true
      },
      trip_distance: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ratecode_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      store_and_fwd_flag: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pu_location_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      do_location_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      payment_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fare_amount: {
        type: Sequelize.STRING,
        allowNull: true
      },
      extra: {
        type: Sequelize.STRING,
        allowNull: true
      },
      mta_tax: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tip_amount: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tolls_amount: {
        type: Sequelize.STRING,
        allowNull: true
      },
      improvement_surcharge: {
        type: Sequelize.STRING,
        allowNull: true
      },
      total_amount: {
        type: Sequelize.STRING,
        allowNull: true
      },
      congestion_surcharge: {
        type: Sequelize.STRING,
        allowNull: true
      },
      airport_fee: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('taxi_trips');
    
  }
};
