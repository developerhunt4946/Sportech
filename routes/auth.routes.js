import express from "express";
import {
  createUser,
  deleteUserById,
  getUserDetailsByEmail,
  loginUser,
  updateUserById,
} from "../controllers/auth.controller.js";

const router = express.Router();

// POST API for creating the user
router.post("/register", createUser);

// POST API for login the user
router.post("/login", loginUser);

//GET api for getting user details
router.get("/user/", getUserDetailsByEmail);

//PUT api for updating user profile
router.get("/user/:id", updateUserById);

//DELETE api for deleting user profile
router.delete("/user/:id", deleteUserById);

export default router;
