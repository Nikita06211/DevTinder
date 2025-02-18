const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require('bcrypt');

app.use(express.json());

app.post("/signup",async (req,res)=>{

    
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

// get user by email
app.get("/user",async(req,res)=>{
    const UserEmail = req.body.emailId;

    try{
        const user = await User.find({emailId : UserEmail});
        if(user.length === 0){
            res.status(400).send("User not found");
        } else {
            res.send(user);
        }
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
});


// get all users from DB
app.get("/feed", async(req,res)=>{
    try{
        const user = await User.find({});
        res.send(user);
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
});


app.delete("/user", async (req,res)=>{
    const userId = req.body.userId;
    try{
        // const user = await User.findByIdAndDelete({_id: userId});
        const user = await User.findByIdAndDelete(userId);

        res.send("user deleted successfully");
    } catch(err){
        res.status(400).send("something went wrong");
    }
})

app.patch("/user/:userId",async (req,res)=>{
    const data = req.body;
    const userId = req.params?.userId;
    try{
        const ALLOWED_UPDATES = [
        "photoUrl","about","ender","age", "skills"
        ]

        const isUpdateAllowed = Object.keys(data).every(
            k=> ALLOWED_UPDATES.includes(k)
        );

        if(!isUpdateAllowed){
            throw new Error("update not allowed");
        }
        const user = await User.findByIdAndUpdate({_id:userId},data, {
            runValidators: true,
        });
        res.send("user updated successfully");
    } catch(err){
        res.status(400).send("something went wrong");
    }
})

connectDB().then(()=>{
    console.log("DB connection established");
    app.listen(3001, ()=>{
        console.log("successfully listening on port 3001");
    });
})
.catch(err=>{
    console.error("DB cannot be connected");
});

