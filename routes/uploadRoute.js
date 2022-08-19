const express = require('express');
const router = express.Router();
const {uploadAndCreateFiles} = require('../controllers/uploadControllers');

router.route('/').post(uploadAndCreateFiles); // upload, create and save file in cloudinary

module.exports = router;