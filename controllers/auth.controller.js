import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { BadRequest, Unauthorized, NotFound } from "../utils/error.js";

//User Registration
export const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role = "User" } = req.body;

    // Check if email is already register
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw BadRequest("Email already Exists!");
    }

    // hashing the passwor
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and save it to the databasse
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });
    await user.save();

    res.status(200).json({
      success: true,
      message: "User registered successfully.",
    });
  } catch (error) {
    console.log("Error Creating User", error);
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // find the user
    const user = await User.findOne({ email });
    if (!user) {
      throw NotFound("User not found");
    }
    // if we have the user then check the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw Unauthorized("Invalid password");
    }

    // if everything is ok then we will return the user with token and details
    // creating JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful.",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error login user", error);
    next(error);
  }
};
