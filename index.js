import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import steamRouter from './routes/steam.route.js'
import addGameRouter from './routes/game.route.js'
import authRouter from './routes/auth.route.js';

import cors from 'cors'

const app = express()
app.use(cors())
dotenv.config()
app.use(express.json())
const port = process.env.PORT || 8080
app.listen(port, ()=> {
    console.log(`App is listening at ${port}`)
})
app.get("/", (req, res) => {
    res.send("Welcome to the app")
})
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("MongoDB Connected")
}).catch(err => console.log(err))



app.use('/steam', steamRouter)
app.use('/game', addGameRouter)
app.use('/auth', authRouter) 

app.use ((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})