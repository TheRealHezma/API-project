'use strict';
const { Model, Validator } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.Spot, { foreignKey: 'spotId' });
      Booking.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Booking.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Spot',
          key: 'id'
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        allownNull: false,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          isBefore: function (value) {
            return value < this.endDate;
          }
        }
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          isAfter: function (value) {
            return value > this.startDate;
          }
        }
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    }, {
    sequelize,
    modelName: 'Booking',
    // modelName: 'Bookings',

  }
  );
  return Booking;

};
