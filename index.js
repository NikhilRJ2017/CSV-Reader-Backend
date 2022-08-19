require('dotenv').config();
require('express-async-errors');
const connectDB = require('./config/db/connect');
const express = require('express');
const app = express();

//*************************** importing routes *********************************/
const filesRoute = require('./routes/filesRoute');
const uploadRoute = require('./routes/uploadRoute');

//*************************** importing other packages *************************/
const cors = require('cors');
const expressFileUpload = require('express-fileupload');
const errorHandler = require('./config/middlewares/error_handler');
const cloudinary = require('cloudinary').v2;
const morgan = require('morgan');

//**************************** security packages ***************************/
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

// install all other security related npm packages while deploying

//**************************** using file upload package **************************/
app.use(expressFileUpload({
    safeFileNames: true,
    preserveExtension: true
}));

//**************************** body parsing middleware ***************************/
app.use(express.json());

//**************************** configuring cloudinary ****************************/
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//**************************** Logger **************************/
app.use(morgan('tiny'))

//**************************** Main routes *****************************/
app.use('/api/v1/files', filesRoute);
app.use('/api/v1/upload', uploadRoute)


//**************************** error handling *****************************/
app.use(errorHandler)

//**************************** spinning up the server *****************************/
const PORT = process.env.PORT || 5000;
const start = async ()=>{
    try {
        await connectDB(process.env.MONGO_DB_URI)
        app.listen(PORT, () => {
            console.log(`Server is up and running on port ${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start();
