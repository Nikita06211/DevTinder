const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
    {

        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
            require: true,
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignored","interested","accepted","rejected"],
                message: `{VALUE} is incorrect status type`
            },
        },
    },
    {
        timestamps: true,
    }
);

connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

connectionRequestSchema.pre("save",function (next) {
    const connectionRequest = this;
    // check if fromUserId == toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You cannot send connection request to yourself");
    }
    next();
});

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;