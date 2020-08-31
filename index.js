const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to data base
connectDB();

app.use(express.json({ extended: false}));

// Define routes
app.use('/', require('./routes/route'));
app.use('/api/shorturl', require('./routes/route'))

const PORT = 5001;

app.listen(PORT, () => console.log("Server is running on port " + PORT));