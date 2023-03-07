import express from "express";
import UserController from "../controllers/userController.js"
import protect from "../middleWare/authMiddleware.js";

const router = express.Router();

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/logout", UserController.logout);
router.get("/getuser", protect, UserController.getUser);
router.get("/loggedin", UserController.loginStatus);
router.patch("/updateuser", protect, UserController.updateUser);
router.patch("/changepassword", protect, UserController.changePassword);

export default router;