const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to data base
connectDB();

app.use(express.json({ extended: false}));

// Serve static index.html
app.use(express.static('./public'));

// Define routes
app.use('/', require('./routes/route'));
app.use('/shorten', require('./routes/route'));
app.use('/:shortUrl', require('./routes/route'));

const PORT = 5001;

app.listen(PORT, () => console.log("Server is running on port " + PORT));