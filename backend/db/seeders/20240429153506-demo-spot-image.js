
'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://test.com/image1.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2,
        url: 'https://test.com/image2.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3,
        url: 'https://test.com/image3.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 4,
        url: 'https://test.com/image4.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }

    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('SpotImages', {
      spotId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
