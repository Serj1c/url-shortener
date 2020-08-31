const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const config = require('config');
const shortid = require('shortid');

module.exports = router;

const Url = require('../models/Url');

// Create a post request to /api/shorturl/shorten

router.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;
    const baseUrl = config.get('baseUrl');

    // Check base url
    if(!validUrl.isUri(baseUrl)) {
        return res.status(401).json('Invalid baseUrl')
    };
    // Create url code for shortened url
    const urlCode = shortid.generate();

    // Check original url whether it is valid or not
    if(validUrl.isUri(originalUrl)) {
       try {
           // Check whether url already exists in db
           let url = await Url.findOne({ originalUrl });

           if(url) {
               res.json(url);
           } else {
               // if does not - create a new one and save it in db
               const shortenedUrl = baseUrl + '/' + urlCode;

               url = new Url({
                urlCode,
                originalUrl,
                shortenedUrl,
                date: new Date()
               });
               await url.save();
               res.json(url);
           }
       } catch (err) {
           console.error(err);
           res.status(500).json('Server error');
       }
    } else {
        return res.status(401).json('Invalid original url')
    }
});

// Create GET request
// Reason: redirect to original url

router.get('/:code', async (req, res) => {
    try {
        // Find shortened url in db 
        const url = await Url.findOne({ urlCode: req.params.code }); 
        
        if(url) {
            res.redirect(url.originalUrl);
        } else {
            res.status(404).json("Url not found!")
        }
    } catch (err) {
        console.error(err);
        res.status(500).json("Server error")
    }
})