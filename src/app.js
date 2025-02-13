const express = require('express');

const app = express();

app.use("/about",(req,res)=>{
    res.send("Hello from the server");
})

app.listen(3001, ()=>{
    console.log("successfully listening on port 3001");
    
});