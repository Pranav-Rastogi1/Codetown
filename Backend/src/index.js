const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const authRouter=require('./routes/userAuth');
const redisClient = require('./config/redis');

app.use(express.json());
app.use(cookieParser());
app.use('/user', authRouter);

const InitializeConnections = async () => {
    try{
        await Promise.all([connectDB(), redisClient.connect()]);
        console.log("All connections established");
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (err) {
        console.error("Error establishing connections:", err);
    }
}
InitializeConnections();





// connectDB().then(async () => {
//     app.listen(process.env.PORT || 3000, () => {
//         console.log(`Server is running on port ${process.env.PORT}`);

//     });
// }).catch((err) => {
//     console.error("Database connection error:", err);
//     process.exit(1);
// });
