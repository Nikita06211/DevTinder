const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required: true,
        index: true,
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
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address"+value);
            }
        }
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
        enum:{
            values: ["Male","Female","Others"],
            message: `{VALUE} is not a valid gender type`,
        },
        // validate(value){
        //     if(!["male","female","other"].includes(value)){
        //         throw new Error("Gender data is not valid");
        //     }
        // },
    },
    photoUrl :{
        type:String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2TgOv9CMmsUzYKCcLGWPvqcpUk6HXp2mnww&s",
        validate(vale){
            if(!validator.isURL(vale)){
                throw new Error("invalid URL"+value);
            }
        }
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

userSchema.index({firstName: 1, lastName: 1});

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({_id : user._id }, "DEV@Tinder$790", {
        expiresIn : "1d",
    });

    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    );

    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);