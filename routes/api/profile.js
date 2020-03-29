const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');

// Load profile model
const Profile = require('./../../models/Profile');
// Load User profile model
const User = require('./../../models/User');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', [ auth,
  [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
  ]
],
async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    company,
    location,
    website,
    bio,
    skills,
    status,
    githubusername,
    youtube,
    twitter,
    instagram,
    linkedin,
    facebook
  } = req.body;

  // Build profile object
  const profileFields = {};
  profileFields.user = req.user.id;
  if (company) profileFields.company = company;
  if (location) profileFields.location = location;
  if (website) profileFields.website = website;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;
  if (skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim());
  }

  // Build social object
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (instagram) profileFields.social.instagram = instagram;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (facebook) profileFields.social.facebook = facebook;

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      return res.json(profile);
    }

    // Create
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});






// @route   POST api/profile
// @desc    Create user profile
// @access  Private
// router.post(
//   '/',
//   passport.authenticate('jwt', { session: false }),
//   (req, res) => {
//     // Get fields
//     const profileFields = {}
//     if (req.body.handle) profileFields.handle = req.body.handle;
//     if (req.body.company) profileFields.company = req.body.company;
//     if (req.body.website) profileFields.website = req.body.website;
//     if (req.body.location) profileFields.location = req.body.location;
//     if (req.body.status) profileFields.status = req.body.status;
//     if (req.body.bio) profileFields.bio = req.body.bio;
//     if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
//     // Skills - split into array
//     if (typeof req.body.skills !== 'undefined') {
//       profileFields.skills = req.body.skills.split(',');
//     }
//     // Social
//     profileFields.social = {};
//     if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
//     if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
//     if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
//     if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
//     if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

//     Profile.findOne({ user: req.user.id }).then(profile => {
//       if (profile) {
//         // Update
//         Profile.findOneAndUpdate(
//           { user: req.user.id },
//           { $set: profileFields },
//           { new: true }
//         ).then(profile => res.json(profile))
//       } else {
//         // Create
//         // Check if handle exists
//         Profile.findOne({ handle: profileFields.handle }).then(profile => {
//           if (profile) {
//             errors.handle = 'That handle already exists';
//             res.status(400).json(errors);
//           }
//         });
//       }
//     });
//   }
// );

module.exports = router