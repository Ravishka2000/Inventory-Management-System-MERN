import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import errorHandler from "./middleWare/errorMiddleware.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const PARAMS = {
    useNewUrlParser: true, 
    useUnifiedTopology: true
};

const URI = process.env.MONGOOSE_URI;

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use("/api/users", userRoute);

app.use(errorHandler);

mongoose.set("strictQuery", false);
mongoose.connect(URI, PARAMS)
    .then(() => {
        app.listen(PORT, 
        () => {
            console.info(`Server running on PORT ${PORT} 🔥`)
        })
    })
    .catch((err) => {
        console.error(err.message)
    });
