const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.use(express.json());

app.post("/signup",async (req,res)=>{

    //creating a new instance of the User model 
    const user = new User(req.body);

    try{
        await user.save();
        res.send("User Added");
    }
    catch (err){
        res.status(400).send("Error saving the user: "+ err.message);
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

app.patch("/user",async (req,res)=>{
    const data = req.body;
    const userId = req.body.userId;
    try{
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

