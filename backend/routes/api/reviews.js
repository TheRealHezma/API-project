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

// Get all reviews by spotId
// router.get('/:spotId/reviews', async (req, res) => {
//     console.log("HHHHHHHHHHEEEEEEEEEEEEELLLLLLLLLOOOOOOOOO")
//     try {
//         const { spotId } = req.params;

//         // Find spot by spotId
//         const spot = await Spot.findByPk(spotId);

//         // If spot not found, return 404 error
//         if (!spot) {
//             return res.status(404).json({ message: "Spot couldn't be found" });
//         }

//         // Find all reviews for the spot
//         const reviews = await Review.findAll({
//             where: { spotId },
//             include: [
//                 { model: User, attributes: ['id', 'firstName', 'lastName'] },
//                 { model: ReviewImage, attributes: ['id', 'url'] }
//             ],
//             attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt']
//         });

//         // Return reviews with user and review image details
//         return res.json({ Reviews: reviews });

//     } catch (error) {
//         console.error('Error:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// });

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

//edit a review
router.put('/:reviewId', requireAuth, async (req, res) => {
    const userId = req.user.id; // Get the ID of the logged-in user
    const { reviewId } = req.params;
    const { review, stars } = req.body;

    const existingReview = await Review.findByPk(reviewId);
    if (!existingReview) {
        return res.status(404).json({ message: "Review couldn't be found" });
    }

    // Check if the logged-in user is the owner of the review
    if (existingReview.userId !== userId) {
        return res.status(403).json({ message: "Forbidden: You are not the owner of this review" });
    }

    const errors = {};
    if (!review || typeof review !== 'string' || review.trim() === '') {
        errors.review = "Review text is required";
    }
    if (!stars || isNaN(stars) || stars < 1 || stars > 5) {
        errors.stars = "Stars must be an integer from 1 to 5";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ message: "Bad Request", errors });
    }

    await existingReview.update({ review, stars });

    res.status(200).json(existingReview);
});

router.delete('/:reviewId', requireAuth, async (req, res) => {
    try {
        const { reviewId } = req.params;

        // Check if the review exists
        const existingReview = await Review.findByPk(reviewId);
        if (!existingReview) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }

        // Delete the review
        await existingReview.destroy();

        // Return success message
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add an image to a review by review id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const { url } = req.body;

    const review = await Review.findByPk(reviewId);
    if (!review) {
        return res.status(404).json({ message: "Review couldn't be found" });
    }

    const reviewImagesCount = await Reviewimage.count({ where: { reviewId } });
    if (reviewImagesCount >= 10) {
        return res.status(403).json({ message: "Maximum number of images for this resource was reached" });
    }
    const newImage = await Reviewimage.create({ reviewId, url });

    res.status(200).json({ id: newImage.id, url: newImage.url });
});


module.exports = router;
