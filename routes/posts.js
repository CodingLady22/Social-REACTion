import express from "express"
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

//* READ
router.get("/", verifyToken, getFeedPosts); // gets all posts of all users
router.get("/:usedId/posts", verifyToken, getUserPosts); // grabs only the posts of a selected user

//* UPDATE
router.patch("/:id/like", verifyToken, likePost); // to like and unlike each post.

export default router;