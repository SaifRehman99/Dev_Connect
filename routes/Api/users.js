const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const bcryptjs = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is Required and must be 5 character')
      .not()
      .isEmpty()
      .isLength({ min: 5 }),
    check('email', 'Please Enter a Valid Email').isEmail(),
    check(
      'password',
      'Password Must be of length 6 or More ',
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Getting details here
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = gravatar.url(email, {
        s: ' 200',
        r: 'pg',
        //if no image associate, default will
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      const salt = await bcryptjs.genSalt(11);

      user.password = await bcryptjs.hash(password, salt);

      await user.save();

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
