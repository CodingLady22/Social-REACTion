import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization"); // this will grab the authorization header sent in the req from the front end (token)
        if(!token) {
            return res.status(403).send("Access Denied");
        }
        // we want token(set on the front end) to start with "Bearer" then we will take everything from the right side of 'Bearer ', ie the token will be placed after the 'space' of "Bearer"
        if(token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}