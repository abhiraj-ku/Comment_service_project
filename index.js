const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const PORT = process.env.PORT

const app = express()
app.get("/",(req,res)=>{
    res.send("hello team cloudsek")
})

app.listen(PORT,()=>{
    console.log("Server running on port: ",PORT)
})