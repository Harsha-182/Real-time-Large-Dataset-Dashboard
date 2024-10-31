const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class SessionHistory extends Model {
       static associate({ User }) {
        SessionHistory.belongsTo(User)
      }
   }
   SessionHistory.init({
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      active_flag: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:1
      },
      access_token: {
        type: DataTypes.STRING,
        allowNull: false
      },
   }, {
    sequelize,
    modelName: 'SessionHistory',
  });

  return SessionHistory;

};