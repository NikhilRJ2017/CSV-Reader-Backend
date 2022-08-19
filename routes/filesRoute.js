const express = require('express');
const router = express.Router();
const { getAllFiles, getSingleFile } = require('../controllers/filesController');

router.route('/').get(getAllFiles); // get all files
router.route('/:id').get(getSingleFile); // get single files and return parsed data

module.exports = router;