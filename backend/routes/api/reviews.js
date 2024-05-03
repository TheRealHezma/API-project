// backend/routes/api/reviews.js
const express = require('express')
const router = express.Router();
const { User, Spot, Booking, Review, Reviewimage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// const validateReviews = [
//     check('address')
//         .exists()
//         .withMessage('Street address is required'),
//     check('city')
//         .exists()
//         .withMessage('City is required'),
//     check('state')
//         .exists()
//         .withMessage('State is required'),
//     check('country')
//         .exists()
//         .withMessage('Country is required'),
//     check('lat')
//         .exists()
//         .withMessage('Latitude is not valid'),
//     check('lng')
//         .exists()
//         .withMessage('Longitude is not valid'),
//     check('name')
//         .exists()
//         .withMessage('Name is required')
//         .isLength({ max: 50 })
//         .withMessage('Name must be less than 50 characters'),
//     check('description')
//         .exists()
//         .withMessage('Description is required'),
//     check('price')
//         .exists()
//         .withMessage('Price per day is required'),
//     handleValidationErrors
// ];

// Get all reviews of the current user
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const reviews = await Review.findAll({
        where: { userId },
        include: [
            { model: User, as: "User", attributes: ['id', 'firstName', 'lastName'] },
            { model: Spot, attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage'] },
            { model: Reviewimage, attributes: ['id', 'url'] }
        ]
    });
    res.status(200).json({ Reviews: reviews });
});


module.exports = router;
