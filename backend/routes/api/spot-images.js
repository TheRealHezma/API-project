// backend/routes/api/spots.js
const express = require('express')
const router = express.Router();
const { User, Spot, Booking, Review, ReviewImage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { validationResult } = require('express-validator');

// const validateSpotCreation = [
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

// Route for deleting a spot image by its ID
router.delete('/:imageId', requireAuth, async (req, res) => {
    const image = await SpotImage.findByPk(req.params.imageId);
    if (!image) return res.status(404).json({ "message": "Spot Image couldn't be found" });

    const spotOwnerId = await image.getSpot().then(res => res.ownerId);
    if (req.user.id != spotOwnerId) {
        return res.status(403).json({ "message": "Forbidden" });
    }

    await image.destroy();

    res.json({ "message": "Successfully deleted" });
});

module.exports = router;
