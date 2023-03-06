import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;

const user = new Schema({
    name: {
        type: String,
        required: [true, "Please Add a Name"]
    },
    email: {
        type: String,
        required: [true, "Please Add a Email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email address"
        ]
    },
    password: {
        type: String,
        required: [true, "Please add a Password"],
        minLength: [6, "Password must be upto 6 Characters"],
        // maxLength: [23, "Password must not be more than 23 Characters"],
    },
    photo: {
        type: String,
        required: [false, "Please add a Photo"]
    },
    phone: {
        type: String,
        default: "+94"
    },
    bio: {
        type: String,
        maxLength: [255, "Bio must not be more than 255 Characters"],
        default: "Bio"
    }
}, {
    timestamps: true,
});

// Encrypt the password

user.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
})

const User = mongoose.model("User", user);
export default User;