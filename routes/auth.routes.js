import express from "express";
import {
  createUser,
  getUserDetailsByEmail,
  loginUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

// POST API for creating the user
router.post("/register", createUser);

//GET api for getting user details
router.get("/user/", getUserDetailsByEmail);

export default router;
