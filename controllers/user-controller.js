const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const signup = async (req,res) => {
    const {name,email,password} = req.body;

    let existingUser;
    try{
        existingUser = await User.findOne({email});

        if(existingUser) {
            return res.status(400).json({msg: "User Already Exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({name,email, password: hashedPassword});

        await user.save();

        return res.status(201).json({msg: "Account Created Successfully"});
    }catch(error){
        return res.status(500).json({msg: error.message});
    }
}

const login = async (req,res) => {
    const {email,password} = req.body;

    let existingUser;
    try{
        existingUser = await User.findOne({email});

        if(!existingUser) {
            return res.status(404).json({msg: "User Not Found"});
        }
        const matchPassword = await bcrypt.compare(password, existingUser.password);

        if(!matchPassword) {
            return res.status(400).json({msg: "Invalid Credentials"});
        }
        const payload = {
            id: existingUser._id,
            name: existingUser.name
        }
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN);
        return res.status(200).json({msg: "Login Successfull", token: token});

    }catch(error){
        return res.status(500).json({msg: error.message});
    }
}

module.exports = {signup: signup, login:login};