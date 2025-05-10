import express from "express";
import { createUser, loginUser } from "../controllers/auth.controller.js";

const router = express.Router();

// POST API for creating the user
router.post("/register", createUser);

// POST API for login the user
router.post("/login", loginUser);

export default router;
