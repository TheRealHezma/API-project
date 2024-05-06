
// backend/routes/api/review-images.js
const express = require('express')
const router = express.Router();
const { User, Spot, Booking, Review, Reviewimage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { validationResult } = require('express-validator');

// Route for deleting a review image by its ID
router.delete('/:imageId', requireAuth, async (req, res) => {
    const image = await Reviewimage.findByPk(req.params.imageId);
    if (!image) return res.status(404).json({ "message": "Review Image couldn't be found" });

    const reviewOwnerId = await image.getReview().then(res => res.userId);
    if (req.user.id != reviewOwnerId) {
        return res.status(403).json({ "message": "Forbidden" });
    }

    await image.destroy();

    res.json({ "message": "Successfully deleted" });
});
module.exports = router;
