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

// const validationErrors = {
//     message: "Bad Request",
//     errors: {
//         page: "Page must be greater than or equal to 1",
//         size: "Size must be greater than or equal to 1",
//         maxLat: "Maximum latitude is invalid",
//         minLat: "Minimum latitude is invalid",
//         minLng: "Maximum longitude is invalid",
//         maxLng: "Minimum longitude is invalid",
//         minPrice: "Minimum price must be greater than or equal to 0",
//         maxPrice: "Maximum price must be greater than or equal to 0"
//     }
// };

const validateQueryFilters = [
    check('page').optional().isInt({ min: 1, max: 10 }).withMessage('Page must be between 1 and 10'),
    check('size').optional().isInt({ min: 1, max: 20 }).withMessage('Size must be between 1 and 20'),
    check('minLat')
        .optional()
        .isFloat()
        .withMessage('Minimum latitude is invalid')
        .custom((value) => {
            if (value < -90) {
                throw new Error('Minimum latitude must be greater than or equal to -90');
            }
            return true;
        }),
    check('maxLat')
        .optional()
        .isFloat()
        .withMessage('Maximum latitude is invalid')
        .custom((value) => {
            if (value > 90) {
                throw new Error('Maximum latitude must be less than or equal to 90');
            }
            return true;
        }),
    check('minLng')
        .optional()
        .isFloat()
        .withMessage('Minimum longitude is invalid; Must be a float')
        .custom((value) => {
            if (value < -180) {
                throw new Error('Minimum longitude must be greater than or equal to -180');
            }
            return true;
        }),
    check('maxLng')
        .optional()
        .isFloat()
        .withMessage('Maximum longitude is invalid; Must be a float')
        .custom((value) => {
            if (value > 180) {
                throw new Error('Maximum longitude must be less than or equal to 180');
            }
            return true;
        }),
    check('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be greater than or equal to 0'),
    check('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be greater than or equal to 0'),
    handleValidationErrors,
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
router.get('/:spotId/bookings', async (req, res) => {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const bookings = await Booking.findAll({
        where: { spotId },
        attributes: ['spotId', 'startDate', 'endDate'],
        include: [{ model: User, attributes: ['id'] }]
    });

    const filteredBookings = bookings.filter(booking => booking.User.id !== spot.ownerId);

    const formattedBookings = filteredBookings.map(booking => ({
        spotId: booking.spotId,
        startDate: booking.startDate,
        endDate: booking.endDate
    }));

    res.status(200).json({ Bookings: formattedBookings });
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

    return res.status(200).json(spot);
});

// Add image to spot based on spot id
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const { spotId } = req.params;
    const { url, preview } = req.body;

    const spot = await Spot.findOne({ where: { id: spotId, ownerId: userId } });

    if (!spot) {
        return res.status(404).json({ message: "Spot not found or doesn't belong to the current user" });
    }


    const newImage = await SpotImage.create({ url, preview, spotId });

    return res.status(200).json(newImage);
});


// create new spot
router.post('/', validateSpotCreation, async (req, res) => {
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
        return res.status(403).json({
            message: "This spot is already booked for the specified dates",
            conflicts: conflicts.map(conflict => ({
                id: conflict.id,
                startDate: conflict.startDate,
                endDate: conflict.endDate
            }))
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

// const validateQueryFilters = [
//     check('page')
//         .optional()
//         .isInt({ min: 1, max: 10 })
//         .withMessage('Page must be between 1 and 10'),
//     check('size')
//         .optional()
//         .isInt({ min: 1, max: 20 })
//         .withMessage('Size must be between 1 and 20'),
//     check('minLat')
//         .optional()
//         .isFloat()
//         .withMessage('Minimum latitude is invalid')
//         .custom((value) => {
//             if (value <= -90) {
//                 throw new Error('Minimum latitude must be greater than or equal to -90');
//             }
//             return true;
//         }),
//     check('maxLat')
//         .optional()
//         .isFloat()
//         .withMessage('Maximum latitude is invalid')
//         .custom((value) => {
//             if (value >= 90) {
//                 throw new Error('Maximum latitude must be less than or equal to 90');
//             }
//             return true;
//         }),
//     check('minLng')
//         .optional()
//         .isFloat()
//         .withMessage('Minimum longitude is invalid; Must be a float')
//         .custom((value) => {
//             if (value <= -180) {
//                 throw new Error('Minimum longitude must be greater than or equal to -180');
//             }
//             return true;
//         }),
//     check('maxLng')
//         .optional()
//         .isFloat()
//         .withMessage('Maximum longitude is invalid; Must be a float')
//         .custom((value) => {
//             if (value >= 180) {
//                 throw new Error('Maximum longitude must be less than or equal to 180');
//             }
//             return true;
//         }),
//     check('minPrice')
//         .optional()
//         .isFloat({ min: 0 })
//         .withMessage('Minimum price must be greater than or equal to 0'),
//     check('maxPrice')
//         .optional()
//         .isFloat({ min: 0 })
//         .withMessage('Maximum price must be greater than or equal to 0'),
//     handleValidationErrors,
// ];


// get spots with query parameter filters
// router.get('/', validateQueryFilters, async (req, res) => {
//     let { page, size, maxLat, minLat, maxLng, minLng, minPrice, maxPrice } = req.query;
//     page = parseInt(page);
//     size = parseInt(size);
//     let maxLa = parseInt(maxLat);
//     let minLa = parseInt(minLat);
//     let maxLn = parseInt(maxLng);
//     let minLn = parseInt(minLng);
//     let minPric = parseInt(minPrice);
//     let maxPric = parseInt(maxPrice);

//     maxLat = parseFloat(maxLa);
//     minLat = parseFloat(minLa);
//     maxLng = parseFloat(maxLn);
//     minLng = parseFloat(minLn);
//     minPrice = parseFloat(minPric);
//     maxPrice = parseFloat(maxPric);
//     // console.log(page, size, maxLat, minLat, maxLng, minLng, minPrice, maxPrice)
//     // console.log(typeof maxLat, typeof minLat, typeof maxLng, typeof minLng, typeof minPrice, typeof maxPrice);
//     // console.log(typeof 5.5)
//     // const errors = {};
//     // if (!page) {
//     //     errors.page = "Page must be greater than or equal to 1";
//     //     res.status(400).json({
//     //         message: 'Validation error',
//     //         errors: errors
//     //     });
//     //     return; // Stop execution here if there are validation errors
//     // }
//     // if (page < 0) {
//     //     errors.page = "Page must be greater than or equal to 1";
//     // }
//     // if (maxLat > 180) {
//     //     errors.maxLat = "Maximum latitude is invalid";
//     // }

//     // if (!size) {
//     //     errors.size = "Size must be greater than or equal to 1";
//     //     size = 10;
//     // }

//     // if (minLat < 0) {
//     //     errors.minLat = "Minimum latitude is invalid";
//     // }

//     // if (maxLng > 90) {
//     //     errors.maxLng = "Maximum longitude is invalid";
//     // }

//     // if (minLng < 0) {
//     //     errors.minLng = "Minimum longitude is invalid";
//     // }

//     // if (minPrice < 0) {
//     //     errors.minPrice = "Minimum price must be greater than or equal to 0";
//     // }

//     // if (maxPrice < minPrice) {
//     //     errors.maxPrice = "Maximum price must be greater than or equal to 0";
//     // }

//     // if (Object.keys(errors).length > 0) {
//     //     res.status(400).json({
//     //         message: 'Bad Request',
//     //         errors: errors
//     //     });
//     //     return; // Stop execution here if there are validation errors
//     // }
//     if (!page) page = 1;
//     if (!size) size = 100;
//     const pagination = {
//         limit: parseInt(size),
//         offset: (parseInt(page) - 1) * parseInt(size)
//     };
//     // console.log(pagination)
//     try {
//         const spots = await Spot.findAll({
//             ...pagination
//         });

//         if (spots.length > 0) {
//             res.status(200).json({ Spots: spots, page: page, size: size });
//             console.log({ Spots: spots, page: page, size: size })
//         } else {
//             res.status(404).json({ message: 'No spots found' });
//         }
//     } catch (error) {
//         console.error('Error retrieving spots:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });


// router.get('/', validateQueryFilters, async (req, res) => {
//     let { page, size, maxLat, minLat, maxLng, minLng, minPrice, maxPrice } = req.query;
//     page = parseInt(page);
//     size = parseInt(size);
//     maxLat = parseInt(maxLat);
//     minLat = parseInt(minLat);
//     maxLng = parseInt(maxLng);
//     minLng = parseInt(minLng);
//     minPrice = parseInt(minPrice);
//     maxPrice = parseInt(maxPrice);

//     if (!page) page = 1;
//     if (!size) size = 10;

//     const pagination = {
//         limit: parseInt(size),
//         offset: (parseInt(page) - 1) * parseInt(size)
//     };

//     // try {
//     const spots = await Spot.findAll({
//         ...pagination
//     });

//     // if (spots.length > 0) {
//     res.status(200).json({ Spots: spots, page: page, size: size });
//     //     } else {
//     //         res.status(404).json({ message: 'No spots found' });
//     //     }
//     // } catch (error) {
//     //     if (error.title === 'SequelizeValidationError') {
//     //         res.status(404).json({
//     //             message: 'Validation error',
//     //             errors: {
//     //                 page: "Page must be greater than or equal to 1",
//     //                 size: "Size must be greater than or equal to 1",
//     //                 maxLat: "Maximum latitude is invalid",
//     //                 minLat: "Minimum latitude is invalid",
//     //                 minLng: "Maximum longitude is invalid",
//     //                 maxLng: "Minimum longitude is invalid",
//     //                 minPrice: "Minimum price must be greater than or equal to 0",
//     //                 maxPrice: "Maximum price must be greater than or equal to 0"
//     //             }
//     //         });
//     //     } else {
//     //         console.error(error);
//     //         res.status(500).json({ message: 'ERR' });
//     //     }
//     // }
// }
// );

router.get('/', validateQueryFilters, async (req, res) => {
    let { page, size, maxLat, minLat, maxLng, minLng, minPrice, maxPrice } = req.query;
    page = parseInt(page);
    size = parseInt(size);
    let maxLa = parseInt(maxLat);
    let minLa = parseInt(minLat);
    let maxLn = parseInt(maxLng);
    let minLn = parseInt(minLng);
    let minPric = parseInt(minPrice);
    let maxPric = parseInt(maxPrice);

    maxLat = parseFloat(maxLa);
    minLat = parseFloat(minLa);
    maxLng = parseFloat(maxLn);
    minLng = parseFloat(minLn);
    minPrice = parseFloat(minPric);
    maxPrice = parseFloat(maxPric);
    const errors = {};

    if (Object.keys(errors).length > 0) {
        res.status(400).json({
            message: 'Bad Request',
            errors: errors
        });
        return;
    }
    if (!page) page = 1;
    if (!size) size = 100;
    const pagination = {
        limit: parseInt(size),
        offset: (parseInt(page) - 1) * parseInt(size),
    };

    try {
        const spots = await Spot.findAll({
            ...pagination,
        });

        if (spots.length > 0) {
            res.status(200).json({ Spots: spots, page: page, size: size });
        } else {
            res.status(404).json({ message: 'No spots found' });
        }
    } catch (error) {
        console.error('Error retrieving spots:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
