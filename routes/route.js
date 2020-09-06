const express = require('express');
const router = express.Router();
const config = require('config');
const shortid = require('shortid');

const Url = require('../models/Url');

router.get('/', (req, res) => {
    res.send()
})

// Create a POST request to /shorten (a new db entry)

router.post('/shorten', async (req, res) => {
    try {
        // Check whether an originalUrl already exists in the db
        let originalUrl = req.body.originalUrl;
        let url = await Url.findOne({ originalUrl })
        if(url) {
            res.send(url);
        } else {
            const baseUrl = config.get('baseUrl');
            const urlCode = shortid.generate();
            const shortenedUrl = baseUrl + '/' + urlCode;
            
            // originalUrl does not exist in the db -> create an unstance in the db
            url = new Url({ urlCode, originalUrl, shortenedUrl });
            await url.save();
            res.json(url);
        }
    } catch (error) {
        console.log(error);
    }
});

// Create a GET request --> redirect to original URL

router.get('/:shortUrl', async (req, res) => {
    try {
        // Find shortened url in db 
        const url = await Url.findOne({ urlCode: req.params.shortUrl }); 
        
        if(url) {
            res.redirect(url.originalUrl);
        } else {
            res.status(404).json("Not found :(")
        }
    } catch (err) {
        console.error(err);
        res.status(500).json("Error, possibly on the server")
    }
});

module.exports = router;