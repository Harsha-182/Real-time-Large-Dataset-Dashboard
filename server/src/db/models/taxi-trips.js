const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class taxi_trips extends Model {
       static associate({ User }) {
        taxi_trips.belongsTo(User)
      }
   }
   taxi_trips.init({
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    VendorID: {
      type: DataTypes.STRING,
      allowNull: true,
      field:'VendorID'
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
    RatecodeID: {
      type: DataTypes.STRING,
      allowNull: true,
      field:'RatecodeID'
    },
    store_and_fwd_flag: {
      type: DataTypes.STRING(1), // Single character (Y or N)
      allowNull: true
    },
    PULocationID: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'PULocationID'
    },
    DOLocationID: {
      type: DataTypes.STRING,
      allowNull: true,
      field:'DOLocationID'
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
    Airport_fee: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'Airport_fee'
    },
   }, {
    sequelize,
    modelName: 'taxi_trips',
  });

  return taxi_trips;

};