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
        allowNull: false,
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
          isBeforeEndDate(value) {
            if (!this.endDate) return;
            return value < this.endDate;
          }
        }
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          isAfterStartDate(value) {
            if (!this.startDate) return;
            return value > this.startDate;
          }
        }
      }, createdAt: {
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
