
'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // Define your schema in the options object for the production environment
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "1313 Disneyland Dr",
        city: "Anaheim",
        state: "California",
        country: "United States of America",
        lat: 33.812,
        lng: -117.942,
        name: "Disneyland Park",
        description: "The happiest place on earth!",
        price: 204,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 2,
        address: "1180 Seven Seas Dr",
        city: "Lake Buena Vista",
        state: "Florida",
        country: "United States of America",
        lat: 28.383,
        lng: -81.573,
        name: "Magic Kingdom",
        description: "The happiest place on earth!",
        price: 202,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 3,
        address: "1-1 Maihama, Urayasu",
        city: "Chiba",
        state: "Tokyo",
        country: "Japan",
        lat: 35.628,
        lng: 139.804,
        name: "Disneyland Tokyo",
        description: "The happiest place on earth!",
        price: 203,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 4,
        address: "77777 Marne-la-Vallée",
        city: "Chessy",
        state: "Île-de-France",
        country: "France",
        lat: 48.876,
        lng: 2.797,
        name: "Disneyland Paris",
        description: "The happiest place on earth!",
        price: 204,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
