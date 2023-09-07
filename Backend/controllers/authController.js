const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const JWT_SECRET = "Neerajisgreat";


exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      name: req.body.name,
      password: pass,
      email: req.body.email,
    });

    const data = {
      user: {
        id: user.id,
      },
    };
    const authData = jwt.sign(data, JWT_SECRET);
    res.json({ success:true, authData });
  } catch (error) {
    
    res.status(500).send("Some error occurred");
  }
};

exports.loginUser = async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json("Wrong Credentials");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      return res.status(400).json("Wrong Credentials");
    }

    const data = {
      user: {
        id: user.id,
      },
    };
    const authData = jwt.sign(data, JWT_SECRET);
    res.json({ success:true, authData });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error2");
  }
};


exports.getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.status(200).send({ success: true, data: user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error 3");
  }
};
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await User.findById(userId);
    const passwordCompare = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!passwordCompare) {
      return res.status(400).json("Current password is incorrect");
    }
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = newHashedPassword;
    await user.save();

    res.json({ success:true,message: "Password changed successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
