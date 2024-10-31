const {
    Model,
  } = require('sequelize');
  const {
    authUtils: {
      hashPassword,
      comparePassword,
    },
  } = require('../../utils');
  
  module.exports = (sequelize, DataTypes) => {
    class Credential extends Model {
      static associate({ User }) {
        Credential.belongsTo(User);
      }
    }
  
    Credential.init({
      user_id: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      sequelize,
      underscored: true,
      modelName: 'Credential',
    });

    Credential.beforeCreate(async(credentials) => {
      const updatedCredentials = credentials;
      const hashedPassword = await hashPassword(credentials.password);
      updatedCredentials.password = hashedPassword;
      return updatedCredentials;
    })

    Credential.beforeUpdate( async ( credentials ) => {
      const isPasswordUpdated=credentials.changed('password');
      if(isPasswordUpdated) {
        const updatedCredentials = credentials;
        const hash = await hashPassword(credentials.password);
        updatedCredentials.password = hash;
        return updatedCredentials;
      }
      return credentials;
    })
    
    Credential.prototype.comparePassword = async function checkPassword(password) {
      return comparePassword(
        password,
        this.password,
      );
    };
  
    return Credential;
  };
  