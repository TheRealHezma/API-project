// // Function to calculate average rating for a spot
// async function calculateAverageRating(spotId) {
//     try {
//         const reviews = await Review.findAll({
//             attributes: ['stars'],
//             where: { spotId: spotId },
//         });

//         if (reviews.length === 0) return 0;

//         const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
//         return totalStars / reviews.length;
//     } catch (error) {
//         console.error('Error calculating average rating:', error);
//         return null;
//     }
// }

// // Function to build filter based on query parameters
// const buildFilter = (query) => {
//     const { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = query;
//     const filter = {};
//     if (query.minLat) filter.lat = { [Op.gte]: parseFloat(minLat) };
//     if (query.maxLat) filter.lat = { ...filter.lat, [Op.lte]: parseFloat(maxLat) };
//     if (query.minLng) filter.lng = { [Op.gte]: parseFloat(minLng) };
//     if (query.maxLng) filter.lng = { ...filter.lng, [Op.lte]: parseFloat(maxLng) };
//     if (query.minPrice) filter.price = { [Op.gte]: parseFloat(minPrice) };
//     if (query.maxPrice) filter.price = { ...filter.price, [Op.lte]: parseFloat(maxPrice) };
//     return filter;
// };

// // Spot route handler
// router.get('/', validateQueryFilters, async (req, res) => {
//    let { page, size, maxLat, minLat, maxLng, minLng, minPrice, maxPrice } = req.query;
//     if (!page) page = 1;
//     if (!size) size = 20;

//     const pagination = {
//         limit: parseInt(size),
//         offset: (parseInt(page) - 1) * parseInt(size)
//     };

//     try {
//         // Build filter based on query parameters
//         const filter = buildFilter(req.query);

//         // Fetch spots based on filter, page, and size
//         const spots = await Spot.findAll({
//             attributes: [
//                 'id', 'ownerId', 'address', 'city', 'state', 'country',
//                 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt'
//             ],
//             include: [{
//                 model: Review,
//                 attributes: ['stars'],
//                 required: false,
//             }],
//             group: ['Spot.id'],
//             where: filter,
//             ...pagination
//         });

//         // Format spots response
//         const formattedSpots = await Promise.all(
//             spots.map(async (spot) => {
//                 const { id, ownerId, address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt } = spot.toJSON();

//                 // Calculate average rating for the spot
//                 const avgRating = await calculateAverageRating(spot.id);

//                 // Find preview image for the spot
//                 const previewImageFind = await SpotImage.findOne({
//                     attributes: ['url'],
//                     where: {
//                         spotId: id,
//                         preview: true,
//                     },
//                     as: 'previewImage',
//                 });

//                 // Construct spot response object
//                 const spotResponse = {
//                     id,
//                     ownerId,
//                     address,
//                     city,
//                     state,
//                     country,
//                     lat: Number(lat),
//                     lng: Number(lng),
//                     name,
//                     description,
//                     price: Number(price),
//                     createdAt,
//                     updatedAt,
//                     avgRating: avgRating > 0 && avgRating !== null ? avgRating : 'Spot has no rating',
//                     previewImage: previewImageFind ? previewImageFind.url : 'Spot has no preview image',
//                 };

//                 return spotResponse;
//             })
//         );

//         // Send response with formatted spots
//         res.status(200).json({
//             Spots: formattedSpots,
//             page: parseInt(page),
//             size: parseInt(size),
//         });
//     } catch (error) {
//         // Handle errors
//         console.error(error);
//         if (error.name === 'SequelizeValidationError') {
//             // Handle validation errors
//             return res.status(400).json({
//                 message: 'Validation error',
//                 errors: error.errors.reduce((acc, err) => {
//                     acc[err.path] = err.message;
//                     return acc;
//                 }, {}),
//             });
//         } else {
//             // Handle other errors
//             res.status(500).json({ message: 'Internal server error' });
//         }
//     }
// });








// get spots with query parameter filters
// router.get('/', validateQueryFilters, async (req, res) => {
//     let { page, size } = req.query;
//     if (!page) page = 1;
//     if (!size) size = 10;

//     const pagination = {
//         limit: parseInt(size),
//         offset: (parseInt(page) - 1) * parseInt(size)
//     };

//     const spots = await Spot.findAll({
//         ...pagination
//     });

//     if (spots.length > 0) {
//         res.status(200).json({ Spots: spots, page: page, size: size });

//     } else
//         res.status(404).json({
//             message: 'Validation error',
//             errors: {
//                 page: "Page must be greater than or equal to 1",
//                 size: "Size must be greater than or equal to 1",
//                 maxLat: "Maximum latitude is invalid",
//                 minLat: "Minimum latitude is invalid",
//                 minLng: "Maximum longitude is invalid",
//                 maxLng: "Minimum longitude is invalid",
//                 minPrice: "Minimum price must be greater than or equal to 0",
//                 maxPrice: "Maximum price must be greater than or equal to 0"
//             }
//         });

// });











// // Validator for minimum and maximum latitude query parameters
// const validateLatQuery = [
//     check('minLat')
//         .optional()
//         .isFloat({ min: -90, max: 90 })
//         .withMessage('Minimum latitude is not valid.'),

//     check('maxLat')
//         .optional()
//         .isFloat({ min: -90, max: 90 })
//         .withMessage('Maximum latitude is not valid.'),

//     handleValidationErrors
// ];
// const validatePriceQuery = [
//     check('minPrice').optional().isFloat({ min: 0 }).withMessage('Minimum price must be a number greater than or equal to 0'),
//     check('maxPrice').optional().isFloat({ min: 0 }).withMessage('Maximum price must be a number greater than or equal to 0'),
//     handleValidationErrors
// ];

// // Validator for minimum and maximum longitude query parameters
// const validateLngQuery = [
//     check('minLng').optional().isFloat({ min: -180, max: 180 }).withMessage('Minimum longitude is not valid.'),
//     check('maxLng').optional().isFloat({ min: -180, max: 180 }).withMessage('Maximum longitude is not valid.'),
//     handleValidationErrors
// ];

// router.get('/', validatePriceQuery, validateLatQuery, validateLngQuery, async (req, res) => {
//     // Extract query parameters
//     const { minLng, maxLng } = req.query;

//     // Query spots with query parameters
//     try {
//         const Spots = await Spot.findAll({
//             // Add your query filters here
//         });

//         // Send response with the retrieved spots
//         res.json(Spots);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// router.get('/', async (req, res) => {
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
//     console.log(typeof (maxLat))
//     const errors = {};

//     if (!page) {
//         errors.page = "Page must be greater than or equal to 1";
//         page = 1;
//         res.status(400).json({
//             message: 'Validation error',
//             errors: errors
//         });
//         return; // Stop execution here if there are validation errors
//     }
//     if (page < 0) {
//         errors.page = "Page must be greater than or equal to 1";
//         res.status(400).json({
//             message: 'Validation error',
//             errors: errors
//         });
//         return; // Stop execution here if there are validation errors
//     }

//     if (!size) {
//         errors.size = "Size must be greater than or equal to 1";
//         size = 100;
//         res.status(400).json({
//             message: 'Validation error',
//             errors: errors
//         });
//         return; // Stop execution here if there are validation errors

//     }

//     if (maxLat >= 180) {
//         errors.maxLat = "Maximum latitude is invalid";
//         res.status(400).json({
//             message: 'Maximum latitude is invalid';
//             errors: errors,
//         });
//         return;
//     }









//     if (minLat < 0) {
//         errors.minLat = "Minimum latitude is invalid";
//     }

//     if (maxLng > 90) {
//         errors.maxLng = "Maximum longitude is invalid";
//     }

//     if (minLng < 0) {
//         errors.minLng = "Minimum longitude is invalid";
//     }

//     if (minPrice < 0) {
//         errors.minPrice = "Minimum price must be greater than or equal to 0";
//     }

//     if (maxPrice < minPrice) {
//         errors.maxPrice = "Maximum price must be greater than or equal to 0";
//     }

//     if (Object.keys(errors).length > 0) {
//         res.status(400).json({
//             message: 'Bad Request',
//             errors: errors
//         });
//         return; // Stop execution here if there are validation errors
//     }
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
