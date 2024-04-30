
'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        userId: 1,
        spotId: 1,
        review: "Super Cool!",
        stars: 5,
      },
      {
        userId: 2,
        spotId: 2,
        review: "Super duper cool!",
        stars: 5,
      },
      {
        userId: 3,
        spotId: 3,
        review: "Really super cool!",
        stars: 5,
      },
      {
        userId: 4,
        spotId: 4,
        review: "Super super cool!",
        stars: 5,
      },
      {
        userId: 1,
        spotId: 4,
        review: "Super Cool!",
        stars: 4,
      },
      {
        userId: 2,
        spotId: 3,
        review: "Super duper cool!",
        stars: 4,
      },
      {
        userId: 3,
        spotId: 2,
        review: "Really super cool!",
        stars: 4,
      },
      {
        userId: 4,
        spotId: 1,
        review: "Super super cool!",
        stars: 4,
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    options.tableName = 'Reviews';
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3, 4] }
    });
  }
};
