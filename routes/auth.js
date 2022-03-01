const express = require("express");
const bcrypt = require("bcrypt");
let Users = require("../models/user");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const router = express.Router();
const saltRounds = 10;

router.post(
  "/signup",
  body("email", "Enter a valid email").isEmail(),
  body("name", "Enter a valid name").isLength({ min: 5 }),
  body("password", "Password must have 5 characters").isLength({ min: 5 }),
  body("age", "Age must be 18 to 30 years").isFloat({ min: 18, max: 30 }),
  async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let salt = await bcrypt.genSalt(saltRounds);
      let hash = await bcrypt.hash(req.body.password, salt);
      let details = req.body;
      details.password = hash;
      let newUser = new Users(details);
      newUser.save();

      return res.status(303).json({ user: newUser });
    } catch (err) {
      return res.status(500).json({ err: err });
    }
  }
);

router.post(
  "/login",
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must have 5 characters").isLength({ min: 5 }),
  async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await Users.findOne({ email: req.body.email });
      let result = await bcrypt.compare(req.body.password, user.password);

      if (!result) {
        return res.status(404).json({ msg: "wrong password" });
      }

      let jwtToken = jwt.sign({ id: user._id }, "secret");
      return res.status(200).json({ token: jwtToken });
    } catch (err) {
      return res.status(500).json({ err: err });
    }
  }
);

module.exports = router;
