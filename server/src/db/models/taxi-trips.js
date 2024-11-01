const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class TaxiTrip extends Model {
       static associate({ User }) {
        TaxiTrip.belongsTo(User)
      }
   }
   TaxiTrip.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    vendor_id: {
      type: DataTypes.STRING,
      allowNull: true,
      // field:'vender_id'
    },
    tpep_pickup_datetime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tpep_dropoff_datetime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    passenger_count: {
      type: DataTypes.STRING,
      allowNull: true
    },
    trip_distance: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ratecode_id: {
      type: DataTypes.STRING,
      allowNull: true,
      // field:'ratecode_id'
    },
    store_and_fwd_flag: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pu_location_id: {
      type: DataTypes.STRING,
      allowNull: true,
      // field: 'pu_location_id'
    },
    do_location_id: {
      type: DataTypes.STRING,
      allowNull: true,
      // field:'do_location_id'
    },
    payment_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fare_amount: {
      type: DataTypes.STRING,
      allowNull: true
    },
    extra: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mta_tax: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tip_amount: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tolls_amount: {
      type: DataTypes.STRING,
      allowNull: true
    },
    improvement_surcharge: {
      type: DataTypes.STRING,
      allowNull: true
    },
    total_amount: {
      type: DataTypes.STRING,
      allowNull: true
    },
    congestion_surcharge: {
      type: DataTypes.STRING,
      allowNull: true
    },
    airport_fee: {
      type: DataTypes.STRING,
      allowNull: true,
      // field: 'airport_fee'
    },
   }, {
    sequelize,
    modelName: 'TaxiTrip',
  });

  return TaxiTrip;

};