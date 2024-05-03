
'use strict';
const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: "2024-04-29",
        endDate: "2024-05-02",
      },
      {
        spotId: 4,
        userId: 1,
        startDate: "2024-10-10",
        endDate: "2024-10-15",
      },
      {
        spotId: 2,
        userId: 2,
        startDate: "2024-05-03",
        endDate: "2021-05-06",
      },
      {
        spotId: 3,
        userId: 3,
        startDate: "2024-05-07",
        endDate: "2024-05-09",
      },
      {
        spotId: 4,
        userId: 4,
        startDate: "2024-05-10",
        endDate: "2024-05-15",
      },


    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
