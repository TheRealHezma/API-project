// backend/routes/api/spots.js
const express = require('express')
const router = express.Router();
const { User, Spot, Booking, Review, Reviewimage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

const validateSpotCreation = [
    check('address')
        .exists()
        .withMessage('Street address is required'),
    check('city')
        .exists()
        .withMessage('City is required'),
    check('state')
        .exists()
        .withMessage('State is required'),
    check('country')
        .exists()
        .withMessage('Country is required'),
    check('lat')
        .exists()
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists()
        .withMessage('Longitude is not valid'),
    check('name')
        .exists()
        .withMessage('Name is required')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists()
        .withMessage('Description is required'),
    check('price')
        .exists()
        .withMessage('Price per day is required'),
    handleValidationErrors
];

const validateSpot = [
    check('review')
        .notEmpty()
        .withMessage('Review text is required'),
    check('stars')
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors

];

const validateBookingTime = [
    check('startDate')
        .isISO8601()
        .toDate()
        .withMessage('Need start date.'),
    check('endDate')
        .isISO8601()
        .toDate()
        .withMessage(' EndDate cannot be on or before startDate.'),
    check('endDate')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.startDate)) {
                throw new Error('End date cannot be on or before start date.');
            }
            return true;
        }),
    handleValidationErrors
];


// Get spots of current user
router.get('/current', requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const spots = await Spot.findAll({ where: { ownerId: userId } });

        if (spots.length > 0) {
            res.json({ spots });
        } else {
            res.json({ message: 'No spots found for the logged-in user' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

//get reviews based on spot id
router.get('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const reviews = await Review.findAll({
        where: { spotId: spotId, },
        include: [
            { model: Reviewimage, attributes: ['id', 'url'], },
            { model: User, attributes: ['id', 'firstName', 'lastName'] }
        ]
    });
    res.status(200).json({ reviews });
});

//get bookings based on spot id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });

    const isOwner = req.user.id === spot.ownerId;
    let bookings = [];

    if (isOwner) {
        bookings = await Booking.findAll({
            attributes: { include: ['id'] },
            include: [
                { model: User },
                { model: Spot, where: { ownerId: req.user.id, id: req.params.spotId }, attributes: [] }
            ]
        });
    } else {
        bookings = await Booking.findAll({
            where: { userId: req.user.id, spotId: req.params.spotId },
            attributes: ['spotId', 'startDate', 'endDate']
        });
    }

    res.json({ Bookings: bookings });
});


// Middleware to check if the spot exists
async function spotExists(req, res, next) {
    const { spotId } = req.params;
    try {
        const spotExists = await Spot.findByPk(spotId);
        if (!spotExists) {
            const err = new Error("Spot doesn't exist");
            err.status = 404;
            return next(err);
        }
        next();
    } catch (error) {
        console.error('Error checking if spot exists:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// POST route to create a review for a spot
router.post('/:spotId/reviews', requireAuth, spotExists, validateSpot, async (req, res) => {
    const { spotId } = req.params;
    const { review, stars } = req.body;
    const userId = req.user.id;

    //   try {
    // Check if the user already has a review for this spot
    const existingReview = await Review.findOne({
        where: {
            userId: userId,
            spotId: spotId
        }
    });

    if (existingReview) {
        return res.status(500).json({ message: "User already has a review for this spot" });
    }

    // Create a new review
    const createdReview = await Review.create({
        userId: userId,
        spotId: spotId,
        review: review,
        stars: stars
    });

    res.status(201).json({
        id: createdReview.id,
        userId: createdReview.userId,
        spotId: createdReview.spotId,
        review: createdReview.review,
        stars: createdReview.stars,
        createdAt: createdReview.createdAt,
        updatedAt: createdReview.updatedAt
    });
    // } catch (error) {
    //     console.error(error);
    //     res.status(404).json({ message: 'Hitting an error' });
    // }
});



// Delete a spot based on spot id
router.delete('/:spotId', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const { spotId } = req.params;

    const spot = await Spot.findOne({ where: { id: spotId, ownerId: userId } });

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    await spot.destroy();

    return res.status(200).json({ message: "Successfully Deleted" });
});

// Update a spot based on spot id
router.put('/:spotId', requireAuth, validateSpotCreation, async (req, res) => {
    const userId = req.user.id;
    const { spotId } = req.params;

    const spot = await Spot.findOne({ where: { id: spotId, ownerId: userId } });

    if (!spot) {
        return res.status(404).json({ message: "Spot could not be found" });
    }

    const { address, city, state, country, name, description, price } = req.body;
    const lat = parseFloat(req.body.lat);
    const lng = parseFloat(req.body.lng);

    await spot.update({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });

    const responseSpot = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt
    };

    return res.status(200).json(responseSpot);
});

// Add image to spot based on spot id
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const { spotId } = req.params;
    const { url, preview } = req.body;

    try {
        const spot = await Spot.findOne({ where: { id: spotId, ownerId: userId } });

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        const newImage = await SpotImage.create({ url, preview, spotId });

        return res.status(200).json({ id: newImage.id, url: newImage.url, preview: newImage.preview });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// create new spot
router.post('/', requireAuth, validateSpotCreation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const validationErrors = errors.array().reduce((acc, error) => {
            acc[error.param] = error.msg;
            return acc;
        }, {});
        return res.status(400).json({ errors: validationErrors });
    }

    const { ownerId, address, city, state, country, lat, lng, name, description, price } = req.body;

    try {
        const newSpot = await Spot.create({
            ownerId,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        });

        res.status(201).json(newSpot);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// Route for creating a new booking for a spot
router.post('/:spotId/bookings', requireAuth, spotExists, validateBookingTime, async (req, res) => {
    const spotId = req.params.spotId;
    const { startDate, endDate } = req.body;

    const newBooking = await Booking.build({
        userId: req.user.id,
        spotId: spotId,
        startDate: startDate,
        endDate: endDate
    });

    await newBooking.validate();

    const conflicts = await Booking.findAll({
        where: {
            spotId: spotId,
            startDate: { [Op.lte]: newBooking.endDate },
            endDate: { [Op.gte]: newBooking.startDate }
        }
    });

    if (conflicts.length !== 0) {
        const errors = {};
        conflicts.forEach(conflict => {
            if (conflict.startDate <= newBooking.endDate && conflict.endDate >= newBooking.startDate) {
                errors.startDate = "Start date conflicts with an existing booking";
                errors.endDate = "End date conflicts with an existing booking";
            }
        });
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: errors
        });
    }

    await newBooking.save();

    return res.status(200).json({
        id: newBooking.id,
        userId: newBooking.userId,
        spotId: newBooking.spotId,
        startDate: newBooking.startDate,
        endDate: newBooking.endDate,
        createdAt: newBooking.createdAt,
        updatedAt: newBooking.updatedAt
    });
});


//Get spots based on id
router.get('/:spotId', async (req, res) => {
    try {
        const { spotId } = req.params;
        const spot = await Spot.findByPk(spotId,
            {
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat',
                    'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt'],
                include: [
                    { model: SpotImage, attributes: ['id', 'url', 'preview'] },
                    { model: User, as: "Owner", attributes: ['id', 'firstName', 'lastName'] }
                ]
            });

        const sum = await Review.sum('stars', { where: { spotId: spotId } });
        const count = await Review.count({ where: { spotId: spotId } });
        const average = sum / count;

        const spotImages = spot.SpotImages.map(image => {
            return {
                id: image.id,
                url: image.url,
                preview: image.preview
            };
        });
        const owner = {
            id: spot.Owner.id,
            firstName: spot.Owner.firstName,
            lastName: spot.Owner.lastName
        };

        const response = {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            numReviews: count,
            avgStarRating: average,
            SpotImages: spotImages,
            Owner: owner
        };
        res.status(200);
        return res.json(response);
    } catch (error) {
        console.error("Error:", error);
        res.status(404).json({ message: "Spot couldn't be found" });
    }
});


//get all spots
// router.get('/', async (req, res) => {
//     try {
//         const spots = await Spot.findAll();

//         if (spots.length > 0) {
//             res.json({ spots });
//         } else {
//             res.json({ message: 'No spots found' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

function formatSpots(spots) {
    spots.forEach(spot => {
        spot.lat = Number(spot.lat);
        spot.lng = Number(spot.lng);
        spot.price = Number(spot.price);

        const totalStars = spot.Reviews.reduce((sum, review) => {
            return sum + review.stars;
        }, 0);
        spot.avgRating = totalStars / spot.Reviews.length;
        delete spot.Reviews;

        spot.SpotImages.forEach(spotImage => {
            if (spotImage.preview === true) spot.previewImage = spotImage.url;
        });
        if (!spot.previewImage) spot.previewImage = 'No preview image';
        delete spot.SpotImages;
    });

    return spots;
}
const validateQueryFilters = [
    check('page')
        .optional()
        .notEmpty()
        .isInt({ min: 1 })
        .withMessage('Page must be greater than or equal to 1'),
    check('size')
        .optional()
        .notEmpty()
        .isInt({ min: 1 })
        .withMessage('Size must be greater than or equal to 1'),
    check('minLat')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Minimum latitude is invalid'),
    check('maxLat')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Maximum latitude is invalid'),
    check('minLng')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Minimum longitude is invalid'),
    check('maxLng')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Maximum longitude is invalid'),
    check('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be greater than or equal to 0'),
    check('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be greater than or equal to 0'),
    handleValidationErrors
];

router.get('/', validateQueryFilters, async (req, res) => {
    const filter = Object.keys(req.query).length > 0;

    let { page, size } = req.query;
    page = parseInt(page);
    size = parseInt(size);
    if (Number.isNaN(page) || page < 0) page = 1;
    if (page > 10) page = 10;
    if (Number.isNaN(size) || size < 0) size = 20;
    if (size > 20) size = 20;
    const limit = size;
    const offset = size * (page - 1);

    let spots;
    if (filter) {
        spots = await Spot.findAll({ include: [{ model: SpotImage }, { model: Review }], limit, offset });
    } else {
        spots = await Spot.findAll({ include: [{ model: SpotImage }, { model: Review }] });
    }

    spots = JSON.parse(JSON.stringify(spots));

    if (req.query.minLat) spots = spots.filter(spot => spot.lat >= +req.query.minLat);
    if (req.query.maxLat) spots = spots.filter(spot => spot.lat <= +req.query.maxLat);
    if (req.query.minLng) spots = spots.filter(spot => spot.lng >= +req.query.minLng);
    if (req.query.maxLng) spots = spots.filter(spot => spot.lng <= +req.query.maxLng);
    if (req.query.minPrice) spots = spots.filter(spot => spot.price >= +req.query.minPrice);
    if (req.query.maxPrice) spots = spots.filter(spot => spot.price <= +req.query.maxPrice);

    spots = formatSpots(spots);

    if (filter) return res.json({ Spots: spots, page, size });
    res.json({ Spots: spots });
});

module.exports = router;
