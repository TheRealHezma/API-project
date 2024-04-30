
'use strict';

const { Reviewimage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // Define your schema in the options object for the production environment
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Reviewimage.bulkCreate([
      {
        reviewId: 1,
        url: "https://test.com/image1.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        reviewId: 2,
        url: "https://test.com/image2.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        reviewId: 3,
        url: "https://test.com/image3.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        reviewId: 4,
        url: "https://test.com/image3.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
      }

    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Reviewimages', {
      reviewId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
