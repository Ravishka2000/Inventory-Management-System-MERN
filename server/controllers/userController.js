import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) => {
    return Jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
};

const registerUser = asyncHandler (async (req, res) => {
    const {name, email, password} = req.body;

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

    const user = await User.create({
        name,
        email,
        password
    })

    // Generate Token
    const token = generateToken(user._id);

    // Send HTTP-only cookie
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 86400000, // 1 day in milliseconds
      });

    if (user){
        const {_id, name, email, phone, photo, bio} = user
        res.status(201).json({
            _id, 
            name,
            email, 
            phone, 
            photo, 
            bio,
            token
        })
    }else{
        res.status(400);
        throw new Error("Invalid user details");
    }
});

const loginUser = asyncHandler (async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password){
        res.status(400);
        throw new Error("Please enter email and password");
    }

    const user = await User.findOne({ email});

    if (!user){
        res.status(400);
        throw new Error("User not found, Please SignUp");
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    // Generate Token
    const token = generateToken(user._id);

    // Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
    });

    if (user && passwordIsCorrect){
        const {_id, name, email, phone, photo, bio} = user
        res.status(200).json({
            _id, 
            name,
            email,
            phone,
            photo, 
            bio,
            token
        })
    } else {
        res.status(400);
        throw new Error("Invalid Email or Password");
    }

});

const logout = asyncHandler (async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0)
    });
    return res.status(200).json({ message: "Successfully Logged Out"})
});

const getUser = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user){
        const {_id, name, email, phone, photo, bio} = user; 
        res.status(200).json({
            _id, 
            name,
            email, 
            phone, 
            photo, 
            bio
        })
    }else{
        res.status(400);
        throw new Error("User not found");
    }
});

const loginStatus = asyncHandler (async (req, res) => {
    const token = req.cookies.token;
    if(!token){
        return res.json(false);
    }

    const verified = Jwt.verify(token, process.env.JWT_SECRET);

    if(verified){
        return res.json(true);
    }
    return res.json(false);
});

const updateUser = asyncHandler (async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user){
        const { name, email, phone, photo, bio } = user; 
        user.email = email;
        user.name = req.body.name || name;
        user.phone = req.body.phone || phone;
        user.bio = req.body.bio || bio;
        user.photo = req.body.photo || photo;

        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email, 
            phone: updatedUser.phone, 
            photo: updatedUser.photo, 
            bio: updatedUser.bio
        })
    }else{
        res.status(400);
        throw new Error("User not found");
    }
});

export default {
    registerUser,
    loginUser,
    logout,
    getUser,
    loginStatus,
    updateUser
};
