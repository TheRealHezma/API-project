// backend/routes/api/index.js
const router = require('express').Router();
// GET /api/restore-user
const { restoreUser } = require('../../utils/auth.js');

// router.use(restoreUser);
router.use(restoreUser);

// router.get(
//     '/restore-user',
//     (req, res) => {
//         return res.json(req.user);
//     }
// );

// // GET /api/set-token-cookie
// const { setTokenCookie } = require('../../utils/auth.js');
// const { User } = require('../../db/models');

// router.get('/set-token-cookie', async (_req, res) => {
//     const user = await User.findOne({
//         where: {
//             username: 'Demo-lition'
//         }
//     });
//     setTokenCookie(res, user);
//     return res.json({ user: user });
// });

// const { requireAuth } = require('../../utils/auth.js');
// router.get(
//     '/require-auth',
//     requireAuth,
//     (req, res) => {
//         return res.json(req.user);
//     }
// );

// router.post('/test', function (req, res) {
//     res.json({ requestBody: req.body });
// });


module.exports = router;
