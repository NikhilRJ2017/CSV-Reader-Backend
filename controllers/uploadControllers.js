const path = require('path');
const fs = require('fs');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../config/errors');
const Files = require('../models/Files');
const cloudinary = require('cloudinary').v2

//************************ upload, create and save the file to cloudinary ************************/
const uploadAndCreateFiles = async (req, res) => {

    if (!req.files) {
        throw new CustomError.BadRequestError("No File Uploaded")
    }

    const csvFile = req.files.csv_file;

    // doing .csv file validation
    if (!csvFile.mimetype.endsWith('csv')) {
        throw new CustomError.BadRequestError("Please select csv file")
    }

    // moving file local folder
    const filePath = path.join(__dirname, '../data/' + `${csvFile.name}`);
    await csvFile.mv(filePath);

    // uploading file to cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'raw', //* other than images and videos all resource types goes as raw
        use_filename: true,
        folder: "CSV-R",
    })

    // getting url and filename from uploaded file
    const { original_filename, public_id } = result;

    // creating file
    const file = await Files.create({ name: original_filename, public_id });

    // delete local files as we have already stored it in cloudinary
    fs.unlinkSync(filePath);

    res.status(StatusCodes.CREATED).json({
        message: "Success",
        file: file
    });

}

module.exports = {
    uploadAndCreateFiles,
}