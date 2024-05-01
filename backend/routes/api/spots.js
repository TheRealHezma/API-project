// backend/routes/api/spots.js
const express = require('express')
const router = express.Router();
const { User, Spot, Booking, Review, ReviewImage, SpotImage } = require('../../db/models');

// const { Spot } = require('../../db/models'); //added this too
// const { setTokenCookie, restoreUser } = require('../../utils/auth');//added this too


// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
//const validateSignup = [
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
//];


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



module.exports = router;
