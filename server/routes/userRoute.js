import express from "express";
import UserController from "../controllers/userController.js"
import protect from "../middleWare/authMiddleware.js";

const router = express.Router();

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/logout", UserController.logout);
router.get("/getuser", protect, UserController.getUser);

export default router;