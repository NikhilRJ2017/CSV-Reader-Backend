const mongoose = require('mongoose');

/**
 * FILE SCHEMA:
 *          name: String,
 *          public_id: String
 */

const FilesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    public_id: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Files = mongoose.model('Files', FilesSchema);
module.exports = Files;