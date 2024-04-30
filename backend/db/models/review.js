
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.Spot, { foreignKey: 'spotId', onDelete: 'CASCADE' });
      Review.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'User' });
      Review.hasMany(models.Reviewimage, { foreignKey: 'reviewId', onDelete: 'CASCADE' });
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER
    },
    review: {
      type: DataTypes.STRING
    },
    stars: {
      type: DataTypes.INTEGER
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
