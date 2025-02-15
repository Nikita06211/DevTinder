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

connectDB().then(()=>{
    console.log("DB connection established");
    app.listen(3001, ()=>{
        console.log("successfully listening on port 3001");
    });
})
.catch(err=>{
    console.error("DB cannot be connected");
});

