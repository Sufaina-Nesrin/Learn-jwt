const express = require("express");
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv")

const app = express()
app.use(express.json())

dotenv.config()

const SECRET = process.env.JWT_SECRET
const playload = {
    name:"john",


}

const options = {
    expiresIn: "1h"
}
const token = jwt.sign(playload, SECRET, )
const decoded = jwt.decode(token, SECRET)

app.listen(process.envPORT, ()=>{
    console.log(`app is connected to the port ${process.env.PORT}`)
    console.log(decoded)
})