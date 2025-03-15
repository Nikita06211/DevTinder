const express = require('express');
const {validateSignUpData} = require("../utils/validation");
const User = require('../models/user');
const bcrypt = require('bcrypt');


const authRouter = express.Router();

authRouter.post("/signup",async (req,res)=>{

    
    try{
        // Validation of data
        validateSignUpData(req);

        // Encrypt the password
        const  {firstName , lastName , emailId ,password} = req.body;

        const passwordHash = await bcrypt.hash(password, 10);
        

        //creating a new instance of the User model 
        const user = new User({
            firstName, lastName, emailId, password : passwordHash,
        });

    
        await user.save();
        res.send("User Added");
    }
    catch (err){
        res.status(400).send("Error : "+ err.message);
    }
});

authRouter.post("/login",async(req,res)=>{
    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});

        if(!user){
            throw new Error("Invalid credentials");
        }    
 
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){

            // create a JWT token
            const token = await user.getJWT();
            
            // add token to cookie and send the res back to user
            res.cookie("token",token, {
                expires: new Date(Date.now()+ 8*3600000),
            });
            res.send(user);
        }
        else{
            throw new Error("Invalid credentials");
        }

    } catch(err){
        res.status(400).send("ERR: "+err.message);
    }
});

authRouter.post("/logout", async(req,res)=>{
    res.cookie("token", null,{
        expires: new Date(Date.now()),
    });
    res.send("Logged out");
});

module.exports = authRouter;