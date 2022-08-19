const https = require('https');
const fs = require('fs');
const path = require('path');
const Files = require('../models/Files');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../config/errors');
const csv = require('csvtojson');
const cloudinary = require('cloudinary').v2

//************************** get all available files ******************************/

const getAllFiles = async (req, res) => {
    const files = await Files.find({});
    res.status(StatusCodes.OK).json({
        message: "Success",
        count: files.length,
        files: files
    })
}

//**************************** get a single file from cloudinary, parse it and send json response ********************/
const getSingleFile = async (req, res) => {

    // getting file id from parameter
    const { id } = req.params;

    // finding file in DB
    const file = await Files.findOne({ _id: id });
    if (!file) {
        throw new CustomError.NotFoundError(`No file found with id ${id}`)
    }

    let jsonData, resource;
    const { name, public_id } = file;
    const filePath = path.join(__dirname, '../data/' + `${name}.csv`);

    // checking if resource is available in cloudinary
    try {
        resource = await cloudinary.api.resource(public_id, { resource_type: 'raw' });
    } catch (error) {
        const { message } = error.error;
        throw new CustomError.NotFoundError(message)
    }

    // if resource is available then fetch the secure url and download file
    try {
        const { secure_url } = resource;
        await downloadFile(secure_url, filePath);
    } catch (error) {
        throw new Error(error)
    }

    //parse csv file
    try {
        jsonData = await parseCSV(filePath);
    } catch (error) {
        throw new CustomError.BadRequestError(error)
    }

    res.status(StatusCodes.OK).json({
        message: "Success",
        count: jsonData.length,
        jsonData: jsonData
    });
}

// download file from cloudinary
const downloadFile = function (link, filePath) {
    let file = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {

        //getting file from cloudinary link
        https.get(link, function (response) {
            response.pipe(file);

            file.on('finish', function () {

                file.close(function (err) {
                    if(err) console.log(err);
                });

                // resolve promise if everything is good
                resolve();
            });
        }).on('error', function (err) {

            fs.unlink(filePath, (err) => {
                if(err) console.log(err);
            });

            reject(err)
        });
    })
};

// parse the downloaded file
const parseCSV = (filePath) => {
    return new Promise(async (resolve, reject) => {

        try {
            let readStream = fs.createReadStream(filePath);
            jsonArray = await csv({ delimiter: "auto" }).fromStream(readStream).on('error', (err) => {
                reject(err)
            });

            // deleting downloaded file, as we no longer need because we have already parsed csv
            fs.unlink(filePath, (err) => {
                if(err) console.log(err);
            });

            //resolving if success
            resolve(jsonArray)

        } catch (error) {
            reject(error)
        }
    });
}

module.exports = {
    getAllFiles,
    getSingleFile
}