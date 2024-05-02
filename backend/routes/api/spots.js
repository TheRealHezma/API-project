// backend/routes/api/spots.js
const express = require('express')
const router = express.Router();
const { User, Spot, Booking, Review, ReviewImage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { validationResult } = require('express-validator');

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


// Add image to spot based on spot id
router.post('/:spotId/images', async (req, res) => {
    const spotId = parseInt(req.params.spotId);
    const userId = parseInt(req.user.userId);
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
        // Create the spot in the database
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

        // Respond with new spot
        res.status(201).json(newSpot);
    } catch (error) {
        // If an error occurs, respond with an error message and status code 500
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
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


// GET all spots
router.get('/', async (req, res) => {
    try {
        const spots = await Spot.findAll();

        if (spots.length > 0) {
            // Spots found
            res.json({ spots });
        } else {
            // No spots found
            res.json({ message: 'No spots found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//Get spots of current user
// router.get('//current', async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const spots = await Spot.findAll({ where: { ownerId: userId } });

//         if (spots.length > 0) {
//           res.json({ spots });
//         } else {
//           res.json({ message: 'No spots found for the logged-in user' });
//         }
//       } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//       }
// })

module.exports = router;