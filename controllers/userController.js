import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateToken } from "../utils.js";

export const signIn = expressAsyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && bcrypt.compareSync(password, user.password)) {
      const userData = extractUserData(user);
      res.send(userData);
    } else {
      res.status(401).send({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

export const signUp = expressAsyncHandler(async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const saltRounds = 2;
    const salt = bcrypt.genSaltSync(saltRounds);

    const newUser = new User({
      name,
      email,
      phone,
      password: bcrypt.hashSync(password, salt),
    });

    const user = await newUser.save();
    const userData = extractUserData(user);

    res.send(userData);
  } catch (err) {
    res.status(401).send({ message: err.message });
  }
});

export const editUserInfo = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });

    if (user) {
      updateUserData(user, req.body);
      const updatedUser = await user.save();

      if (!updatedUser) {
        res.status(403).send({ message: "Update not successful" });
      } else {
        const userData = extractUserData(updatedUser);
        res.send(userData);
      }
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

const extractUserData = (user) => {
  const { _id, name, email, phone, status, profession, description } = user;
  return {
    _id,
    name,
    email,
    phone,
    status,
    profession,
    description,
    token: generateToken(user),
  };
}

const updateUserData = (user, data) => {
  user.name = data.name || user.name;
  user.phone = data.phone || user.phone;
  user.description = data.description || user.description;
  user.status = data.status || user.status;
  user.profession = data.profession || user.profession;
}