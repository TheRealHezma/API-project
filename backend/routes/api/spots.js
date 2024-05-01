// backend/routes/api/spots.js
const express = require('express')
const router = express.Router();
const { Spot } = require('../../db/models'); //added this too
// const { setTokenCookie, restoreUser } = require('../../utils/auth');//added this too


// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const validateSignup = [
    // check('email')
    //     .exists({ checkFalsy: true })
    //     .isEmail()
    //     .withMessage('Please provide a valid email.'),
    // check('username')
    //     .exists({ checkFalsy: true })
    //     .isLength({ min: 4 })
    //     .withMessage('Please provide a username with at least 4 characters.')//,
    //     // check('username') //there is a commented out comma on the upper line
    //     .not()
    //     .isEmail()
    //     .withMessage('Username cannot be an email.'),
    // check('password')
    //     .exists({ checkFalsy: true })
    //     .isLength({ min: 6 })
    //     .withMessage('Password must be 6 characters or more.'),
    // handleValidationErrors
];

// Get All Spots
router.get(
    '/spots',
    (req, res) => {
        const { spot } = req;
        console.log("HELLOOOOOOO")
        if (spot) {
            const spotDetail = {
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
                previewImage: spot.previewImage,
            };
            return res.json({
                spot: spotDetail
            });
        } else return res.json({ spot: null });
    }
);



module.exports = router;
