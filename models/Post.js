import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        location: String,
        description: String,
        picturePath: String,
        userPicturePath: String,
        // this checks to see if the userId is in the map and the value will always be true if it does exist. If post is liked, userId is added to map. If post is unliked, id is removed. This is more efficient than storing ids in an array.
        likes: {
            type: Map,
            of: Boolean,
        },
        comments: {
            type: Array,
            default: []
        }
    },
    { timeStamps: true }
)

const Post = mongoose.model("Post", PostSchema);

export default Post;