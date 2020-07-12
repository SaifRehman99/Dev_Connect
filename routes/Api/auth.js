const router = require('express').Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route   GET api/auth
// @desc    Test Route
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      '-password',
    );
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(401).send('Server Error');
  }
});

// @route   POST api/auth
// @desc    Login User
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please Enter a Valid Email').isEmail(),
    check('password', ' Password is Required').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Getting details here
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcryptjs.compare(
        password,
        user.password,
      );

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        },
      );
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  },
);

module.exports = router;
