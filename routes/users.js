import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

//* READ ROUTES

router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

//* UPDATE ROUTES
router.patch("/:id/:friendId", verifyToken, addRemoveFriend)
// Using '.patch' here instead of '.put'. This grabs both the user id and the id of the friends of the user so they can be added or removed (like facebook.)

export default router;