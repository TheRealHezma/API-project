
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Reviewimage extends Model {
    static associate(models) {
      Reviewimage.belongsTo(models.Review, { foreignKey: 'reviewId', onDelete: 'CASCADE' });
    }
  }
  Reviewimage.init({
    reviewId: {
      type: DataTypes.INTEGER
    },
    url: {
      type: DataTypes.Sting
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'Reviewimage',
  });
  return Reviewimage;
};
