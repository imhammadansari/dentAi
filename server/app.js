const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const app = express();

dotenv.config();
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

const URL = process.env.MONGODB_URL;
const connectDB = async () => {
    try {
        await mongoose.connect(URL);
        console.log("Databse Connected");
    } catch (error) {
        console.log("MongoDB Connection failed", error.message);
        process.exit();

    }
}

connectDB()

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const userRoute = require('./src/routes/patientRoute');
const dentistRoute = require('./src/routes/dentistRoute');
const adminRoute = require('./src/routes/adminRoute');
const aiRoute = require('./src/routes/analysis');
const { verifyToken } = require('./src/middlewares/verifyToken');


app.use("/api/users", userRoute);
app.use("/api/dentists", dentistRoute);
app.use("/api/admin", adminRoute);
app.use("/api/analysis", aiRoute);

app.post("/api/test", verifyToken, async (req, res) => {
    console.log("Tested")
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is listening at PORT: ${PORT}`)
})