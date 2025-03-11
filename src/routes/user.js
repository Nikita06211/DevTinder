const express = require('express');
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequestModel = require('../models/connectionRequest');


const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// Get all the pending connection request for all the loggedIn user
userRouter.get("/user/requests/received", userAuth, async(req,res)=>{
    
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId",["firstName", "lastName"]);
        res.json({message:"Data fetched successfully", data: connectionRequests})

    }catch(err){
        req.statusCode(400).send("ERR: "+err.message);
    }

});

userRouter.get("/user/connections",userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            $or :[
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"},
            ],
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);    
        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        }
    );

        res.json({data: data});
    }catch(err){
        res.status(400).send({message:err.message});
    }
});

module.exports = userRouter;