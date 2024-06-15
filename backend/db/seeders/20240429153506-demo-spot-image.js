
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
        url: 'https://e7.pngegg.com/pngimages/999/59/png-clipart-walt-disney-world-sleeping-beauty-castle-hong-kong-disneyland-tokyo-disneyland-the-walt-disney-company-tokyo-disney-castle-building-photography.png',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2,
        url: 'https://e7.pngegg.com/pngimages/999/59/png-clipart-walt-disney-world-sleeping-beauty-castle-hong-kong-disneyland-tokyo-disneyland-the-walt-disney-company-tokyo-disney-castle-building-photography.png',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3,
        url: 'https://e7.pngegg.com/pngimages/999/59/png-clipart-walt-disney-world-sleeping-beauty-castle-hong-kong-disneyland-tokyo-disneyland-the-walt-disney-company-tokyo-disney-castle-building-photography.png',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 4,
        url: 'https://e7.pngegg.com/pngimages/999/59/png-clipart-walt-disney-world-sleeping-beauty-castle-hong-kong-disneyland-tokyo-disneyland-the-walt-disney-company-tokyo-disney-castle-building-photography.png',
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
