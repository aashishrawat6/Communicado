import express from "express"; 
import { signup, login, logout, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.put("/update-profile", protectRoute, updateProfile);//protectRoute is a middleware to protect the route, if true then only updateProfile will be executed
router.get("/check",protectRoute,checkAuth);

export default router;  