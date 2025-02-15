const mongoose = require('mongoose');

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://bansalnikita06:UcQoDmzGSbIonY8T@namastenode.i2tyb.mongodb.net/devTinder");
}

module.exports = connectDB;


