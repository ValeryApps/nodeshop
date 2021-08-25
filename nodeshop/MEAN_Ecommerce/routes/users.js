const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Product } = require("../models/product");

router.get(`/`, async (req, res) => {
  try {
    const userList = await User.find().select("name phone city");

    if (!userList) {
      res.status(500).json({ success: false });
    }
    res.send(userList);
  } catch (error) {
    res.status(400).send({ errorMessage: "You are not authorized" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    res.send(user);
  } catch (error) {
    res.status(404).send("User not found");
  }
});

router.post("/register", async (req, res) => {
  const user = User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  try {
    const newUser = await user.save();
    if (newUser) {
      return res.status(201).send(newUser);
    } else {
      return res.status(400).json({
        error: true,
        message: "There was an error",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  const existUser = await User.findById(req.params.id);

  let passwordHash;
  if (req.body.password) {
    passwordHash = bcrypt.hashSync(req.body.password, 10);
  } else {
    passwordHash = existUser.passwordHash;
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: passwordHash,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    },
    { new: true }
  );

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
});
router.post("/login", async (req, res) => {
  const secret = process.env.SECRET;
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const verifyPassword = bcrypt.compareSync(
      req.body.password,
      user.passwordHash
    );
    if (!verifyPassword) {
      res.status("400").send("Invalid email or password");
    } else {
      const token = jwt.sign(
        { userId: user.id, isAdmin: user.isAdmin },
        secret,
        { expiresIn: "1d" }
      );
      res.status(200).send({
        token,
      });
    }
  } else {
    res.status("400").send("Invalid email or password");
  }
});
router.get(`/get/count`, async (req, res) => {
  const userCount = await User.countDocuments((count) => count);
  if (!userCount) {
    res.status(500).json({ success: false });
  }
  res.send({ userCount });
});
router.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "the user is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "user not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
