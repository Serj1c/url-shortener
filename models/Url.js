const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    urlCode: {
        type: String,
        require: true
    },
    originalUrl: {
        type: String,
        require: true
    },
    shortenedUrl: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('Url', urlSchema);