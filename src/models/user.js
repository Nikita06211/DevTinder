const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required: true,
        menLength: 4,
        maxLength: 50,
    },
    lastName : {
        type : String,
    },
    emailId : {
        type : String,
        required: true,
        unique: true, 
        lowercase: true,
        trim: true,
    },
    password :{
        type: String,
        required: true,
    },
    age :{
        type: Number,
        min: 18,
    },
    gender : {
        type : String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        },
    },
    photoUrl :{
        type:String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2TgOv9CMmsUzYKCcLGWPvqcpUk6HXp2mnww&s",
    },
    about:{
        type: String,
        default : "This is default desc of user",
    },
    skills:{
        type: [String],
    },
},
{
    timestamps:true
}
);

module.exports = mongoose.model("User", userSchema);