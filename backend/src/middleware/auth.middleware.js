import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async(req, res, next)=>{ // next is written so that the next function can be executed which is written next to this function
    try {
        const token = req.cookies.jwt; // jwt is the name of the cookie we gave in utils.js

        if(!token){
            return res.status(401).json({message: "Unauthorized access - No token found"});
        }

        // to get the cookie from jwt token we will use cookie-parser
        // now we will verify the token using jwt.verify
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // process.env.JWT_SECRET is the secret key we gave in .env file

        if(!decoded){
            return res.status(401).json({message: "Unauthorized access - Invalid token"});
        }

        // inside decoded we will get userId, then we will select everything from the user except password
        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        // if user is found then we will pass the user to req.user, then we will call the next function
        req.user = user;
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        return res.status(500).json({message: "Internal Server Error"});
    }
}