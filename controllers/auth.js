import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// * REGISTER USER
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body
        // encrypting user password.
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        })
        const savedUser = await newUser.save();
        res.status(201).json(savedUser); // if an error occurs, we send a 201 with the json version of the created savedUser
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// * LOGGIN IN

export const login = async (req, res) => {
    try {
        const { email, password } = req.body; //destructuring email and pass from body
        const user = await User.findOne({ email: email });
        if(!user) return res.status(400).json({ msg: "User does not exist." });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ msg: "Invalid password." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password; // to make sure it doesn't sent it back to the frontend after comparison.
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}