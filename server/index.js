const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRoute = require("./Routes/userRoute.js")
const chatRoute = require("./Routes/chatRoute.js")
const messageRoute = require("./Routes/messageRoute.js")
const socketio = require('socket.io')
const http = require ('http')



const PORT = process.env.PORT || 5000;


const app = express();



    dotenv.config();

app.use(express.json())
app.use(cors());
app.use("/api/users",userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.get('/',(req,res)=>
{
    res.send("welcome tp our chat app..")
})

const uri = process.env.ATLAS_URI;

 app.listen(PORT,(req,res) => {console.log(`server has started on ${PORT}`)});



mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then(()=>console.log('mongodb connection establish')).catch((err)=>console.log("got error in mongodb",err.message));



   







