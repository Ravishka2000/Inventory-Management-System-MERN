import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

const registerUser = asyncHandler (async (req, res) => {
    const {name, email, password} = req.body

    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please fill all required fields");
    }

    if(password.length < 6){
        res.status(400);
        throw new Error("Password must be at least 6 characters");
    }

    const userExists = await User.findOne({email});

    if (userExists){
        res.status(400);
        throw new Error("Email already exists");
    }

    // Encrypt the password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password : hashedPassword
    })

    if (user){
        const {_id, name, email, phone, photo, bio} = user
        res.status(201).json({
            _id, 
            name,
            email, 
            phone, 
            photo, 
            bio

        })
    }else{
        res.status(400);
        throw new Error("Invalid user details")
    }
});

export default {
    registerUser
}
