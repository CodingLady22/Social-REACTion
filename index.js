import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path"; //native to node
import { fileURLToPath } from "url"; // will allow us properly set the paths when we configure directories
import authRoutes from "./routes/auth.js";
import { register } from "./controllers/auth.js";

// * CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url); // used to grab the file url only when using "type": "module" to get directory name
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded ({ limit: "30mb", extended: true }));
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

// * FILE STORAGE
// ! info from multer github repo
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets"); // any files will be saved in this destination.
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage }); // var to upload files anytime 

//* ROUTES WITH FILES
// The full routes used here need access the 'upload' var above to upload files/images. 
app.post("/auth/register", upload.single("picture"), register); 

//* ROUTES
app.use("/auth", authRoutes)

//* MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server is : ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`))