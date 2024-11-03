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
    },
    tpep_pickup_datetime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tpep_dropoff_datetime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    passenger_count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    trip_distance: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ratecode_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    store_and_fwd_flag: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pu_location_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    do_location_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fare_amount: {
      type: DataTypes.FLOAT,
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
    },
   }, {
    sequelize,
    modelName: 'TaxiTrip',
  });

  return TaxiTrip;

};