const { Op } = require('sequelize');
const { Review } = require('../db/models');

const filtering = (query) => {
    const { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = query;
    const filter = {};
    if (minLat !== undefined && maxLat !== undefined) filter.lat = { [Op.between]: [parseFloat(minLat), parseFloat(maxLat)] };
    if (minLng !== undefined && maxLng !== undefined) filter.lng = { [Op.between]: [parseFloat(minLng), parseFloat(maxLng)] };
    if (minPrice !== undefined && maxPrice !== undefined) filter.price = { [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)] };
    return filter;
};

async function avgRate(spotId) {
    try {
        const reviews = await Review.findAll({
            attributes: [[sequelize.fn('AVG', sequelize.col('stars')), 'averageStars']],
            where: { spotId: spotId },
        });

        return reviews.length > 0 ? parseFloat(reviews[0].dataValues.averageStars) : 0;
    } catch (error) {
        console.error('Error calculating average rating:', error);
        return null;
    }
}

module.exports = {
    avgRate,
    filtering,
};
