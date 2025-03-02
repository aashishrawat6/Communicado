import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar , getMessages, sendMessage} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users",protectRoute, getUsersForSidebar);
router.get("/:id",protectRoute, getMessages); // same name 'id' as in message.controller.js which we get from params

router.post("/send/:id",protectRoute, sendMessage); // to send message to a user from our side
export default router;