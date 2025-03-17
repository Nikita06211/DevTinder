const express = require('express');
const {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");
const user = require('../models/user');
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth ,async (req,res)=>{
    try{
        const user = req.user;

        res.send(user);
    } catch (err) {
        res.status(400).send("ERR: "+err.message);        
    }
});

profileRouter.patch("/profile/edit",userAuth, async (req,res)=>{
    try{
       if(!validateEditProfileData(req)){
        throw new Error("invalid edit request");
       }
       const loggedInUser = req.user;
       Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);

       await loggedInUser.save();

       res.json({
        message: `${loggedInUser.firstName}, Edit was successfull`,
        data:loggedInUser,
       });

    } catch(err){
        res.status(400).send("ERR: "+err.message)
    }
});


module.exports = profileRouter;