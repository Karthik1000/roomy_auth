const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator/check");

//@route GET api/profile/me
//@access private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await User.findOne({ _id: req.user.id });
    let user_details = {
      name : profile.name,
      email : profile.email,
      isVerified: profile.isVerified,
      isOwner: profile.isOwner
    }
    res.send(user_details);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "server error" });
  }
});

//@route POST api/profile
//@access private
router.post(
  "/",
  [
    auth,
    [
      check("skills", "skills are required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { skills, website } = req.body;
    const profileFields = {};
    profileFields.user = req.user.id;
    if (website) profileFields.website = website;
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "server error" });
    }
  }
);

//@route GET profile of one user by id api/profile/user/:user_id
//@access public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      res.status(400).json({ msg: "profile not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      res.status(400).json({ msg: "profile not found" });
    }
    res.status(500).json({ msg: "server error" });
  }
});

//@route GET all profiles api/profile
//@access public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("wuser", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "server error" });
  }
});

//@route DELETE user api/profile
//@access private

router.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "user deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "server error" });
  }
});

module.exports = router;
