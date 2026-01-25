import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next)=> {
    const {username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = User({username, email, password:hashedPassword});
    try {
        await newUser.save();
        res.status(201).json('User created successfully!');
        console.log("user generataed successfully");
    } catch (error){
        console.log('error is', error);
        next(error);
    }
}

export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    console.log(req.body);
    console.log(email, password);
    try {
        const validUser = await User.findOne({email});
        if (!validUser){
            console.log('user not found');
            return next(errorHandler(404, 'User not found!'));
        }
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword){
            console.log('wrong credentials');
            return next(errorHandler(401, 'Wrong Credentials!'));
        }
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
        const {password:pass, ...rest} = validUser._doc;
        res.cookie('access_token', token, {
            httpOnly: true
        })
        .status(200)
        .json(rest);
        console.log('signed in successfully');
    } catch (error){
        console.log(error);
        next(error);
    }
}


export const google = async (req,  res, next) => {
    const {username, email, avatar} = req.body;
    console.log(req.body)
    try {
        const user = await User.findOne({email});
        if (user){
            console.log("User exist");
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            const {password, ...rest} = user._doc;
            res 
            .cookie('access_token', token, {httpOnly:true})
            .status(200)
            .json(rest);
        } else {
            console.log("User do not exist, creating one");
            const generatedPassword  = Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
            const customUsername = username.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4)
            const newUser = new User({username:customUsername, email, password:hashedPassword, avatar} )
            await newUser.save();
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
            const {password, ...rest} = newUser._doc;
            res 
            .cookie('access_token', token, {httpOnly:true})
            .status(200)
            .json(rest);
        }

    } catch(error) {
        next(error)
    }
}