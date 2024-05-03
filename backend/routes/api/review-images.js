// backend/routes/api/spots.js
const express = require('express')
const router = express.Router();
const { User, Spot, Booking, Review, ReviewImage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { validationResult } = require('express-validator');


// Route for deleting a review image by its ID
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    try {
        const imageId = req.params.imageId;

        const spotImage = await SpotImage.findByPk(imageId);

        if (!spotImage) {
            return res.status(404).json({ message: "Spot image not found" });
        }

        await spotImage.destroy();

        return res.status(200).json({ message: "Spot image deleted successfully" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
