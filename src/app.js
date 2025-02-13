const express = require('express');

const app = express();

// this will only handle GET api calls
app.get("/user",(req,res)=>{
    res.send({firstName :"sneha", lastName:"mishra"});
});

app.post("/user",(req,res)=>{
    console.log("save data");
    res.send("data saved");
});



// this will match all the http method api calls to "/"
app.use("/",(req,res)=>{
    res.send("Hello from the server");
})

app.listen(3001, ()=>{
    console.log("successfully listening on port 3001");
});