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

// Route for deleting a review image by its ID
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    try {
        const imageId = req.params.imageId;

        // Find the spot image by its ID
        const spotImage = await SpotImage.findByPk(imageId);

        // If the spot image does not exist, return a 404 error
        if (!spotImage) {
            return res.status(404).json({ message: "Spot image not found" });
        }

        // Delete the spot image
        await spotImage.destroy();

        // Return a success message
        return res.status(200).json({ message: "Spot image deleted successfully" });
    } catch (error) {
        // If an error occurs, pass it to the error-handling middleware
        next(error);
    }
});

module.exports = router;
