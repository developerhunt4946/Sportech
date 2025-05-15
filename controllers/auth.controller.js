import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { BadRequest, Unauthorized, NotFound } from "../utils/error.js";

//User Registration
export const createUser = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      role = "User",
    } = req.body;

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
      dateOfBirth,
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

export const getUserDetailsByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email });
    if (!user) {
      throw NotFound("No user found!");
    }

    // if user is found the return the user
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city,
        state: user.state,
        country: user.country,
        profilePic: user.profilePic,
        dateOfBirth: user.dateOfBirth,
      },
    });
  } catch (error) {
    console.log("Error getting user details", error);
    next(error);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = User.findById(id);
    if (!user) {
      throw NotFound("No user found.");
    }

    const updatableFields = ["phone", "city", "state", "country", "profilePic"];
    const updatedFields = {};

    for (const field of updatableFields) {
      if (updates[field] !== undefined) {
        user[field] = updates[field];
        updatedFields[field] = updates[field];
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User Profile updated succesfully.",
    });
  } catch (error) {
    console.log("Error updating user", error);
    next(error);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw NotFound("User not found!");
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.log("Error Deleting User", error);
    next(error);
  }
};
