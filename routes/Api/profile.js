const router = require('express').Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const Axios = require('axios');
const config = require('config');
const { check, validationResult } = require('express-validator');

// @route   GET api/profile/me
// @desc    Get Current User
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'No profile found of this user' });
    }

    res.json(profile);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile
// @desc    Create & Update Profile
// @access  Private

router.post(
  '/',
  [
    auth,
    check('status', 'Status is Required').not().isEmpty(),
    check('skills', 'Skills is Required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // Building Profile Object
    const profileFields = {};

    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    // Building socail Object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({
        user: req.user.id,
      });

      if (profile) {
        // Updating Profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true },
        );

        return res.status(200).json(profile);
      }

      console.log(profileFields);

      // Creating Profile
      profile = new Profile(profileFields);

      await profile.save();

      return res.status(200).json(profile);
    } catch (error) {
      console.log(error);

      res.status(400).send('Server Error');
    }
  },
);

// @route   GET api/profile
// @desc    Get all users
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);

    res.json(profiles);
  } catch (error) {
    console.log(error);
    return res.status(400).send('Server Error');
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get user by id
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json({ msg: 'No profile found' });

    res.json(profile);
  } catch (error) {
    console.log(error.kind);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'No profile found' });
    }
    res.status(400).send('Server Error');
  }
});

// @route   DELETE api/profile
// @desc    Delete Profile, User, Post
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    await Post.deleteMany({ user: req.user.id });
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User Deleted' });
  } catch (error) {
    console.log(error);
    return res.status(400).send('Server Error');
  }
});

// @route   PATCH api/profile/experience
// @desc    Add Experience
// @access  Private
router.patch(
  '/experience',
  [
    auth,
    check('title', 'Title is Required').not().isEmpty(),
    check('company', 'Company is Required').not().isEmpty(),
    check('from', 'Drom date is Required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExperience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({
        user: req.user.id,
      });

      profile.experience.unshift(newExperience);
      await profile.save();

      res.json(profile);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error');
    }
  },
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete Profile Experience
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get Index
    const removeIndex = profile.experience

      // Getting the id in array
      .map((item) => item.id)

      //selecting the index of that id
      .indexOf(req.params.exp_id);

    // Get Index Too
    // const index = profile.experience.map((exp, index) => {
    //   if (exp._id == req.params.exp_id) return index;
    // });

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.log(error);
    return res.status(400).send('Server Error');
  }
});

// @route   PATCH api/profile/education
// @desc    Add Education
// @access  Private
router.patch(
  '/education',
  [
    auth,
    check('school', 'School is Required').not().isEmpty(),
    check('degree', 'Degree is Required').not().isEmpty(),
    check('fieldofstudy', 'Field of Study is Required').not().isEmpty(),
    check('from', 'From date is Required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const newEducation = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({
        user: req.user.id,
      });

      profile.education.unshift(newEducation);
      await profile.save();

      res.json(profile);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error');
    }
  },
);

// @route   DELETE api/profile/education/:exp_id
// @desc    Delete Profile Education
// @access  Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get Index
    const removeIndex = profile.education

      // Getting the id in array
      .map((item) => item.id)

      //selecting the index of that id
      .indexOf(req.params.edu_id);

    // Get Index Too
    // const index = profile.education.map((exp, index) => {
    //   if (exp._id == req.params.exp_id) return index;
    // });

    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/github/:username
// @desc    Get user repos and stuff
// @access  Public
router.get('/github/:username', async (req, res) => {
  try {
    const response = await Axios.get(
      `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubID',
      )}&client_secret=${config.get('githubSecret')}`,
    );
    res.json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Server Error');
  }
});
module.exports = router;
