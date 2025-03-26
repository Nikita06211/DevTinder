const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req,res,next) =>{
    // read the token from req cookies
    try
    {
        const {token} = req.cookies;
        if(!token){
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
        
        const {_id} = decodedObj;
        
        const user = await User.findById(_id);
        if(!user){
            throw new Error("user not found");
        }
        req.user = user;
        next();
    } catch(err) {
        res.status(400).send("Err: "+err.message);
    }
};

module.exports = {
    userAuth,
};