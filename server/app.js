const dotenv = require('dotenv');
dotenv.config();
console.log("ABLY KEY:", process.env.ABLY_API_KEY);
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const app = express();

// app.use(cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true
// }))

app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true
}))


const URL = process.env.MONGODB_URL;
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);

        console.log("Database Connected");

        app.listen(PORT, () => {
            console.log(`Server is listening at PORT: ${PORT}`);
        });

    } catch (error) {
        console.log("MongoDB Connection failed:", error.message);
        process.exit(1);
    }
};

startServer();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const userRoute = require('./src/routes/patientRoute');
const dentistRoute = require('./src/routes/dentistRoute');
const slotsRoute = require('./src/routes/slotsRoute');
const adminRoute = require('./src/routes/adminRoute');
const aiRoute = require('./src/routes/analysis');
const bookingRoutes = require('./src/routes/bookingRoutes');
const chatRoutes = require('./src/routes/chatRoutes');

const { verifyToken } = require('./src/middlewares/verifyToken');

app.use((req, res, next) => {
    console.log(`>>> ${req.method} ${req.url}`);
    next();
});

app.use("/api/users", userRoute);
app.use("/api/dentists", dentistRoute);
app.use("/api/slots", slotsRoute);
app.use("/api/admin", adminRoute);
app.use("/api/analysis", aiRoute);
app.use("/api/bookings", bookingRoutes);
app.use("/api/chat", chatRoutes);

app.post("/api/test", verifyToken, async (req, res) => {
    console.log("Tested")
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is listening at PORT: ${PORT}`)
})