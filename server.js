const express = require('express');
const connectDB = require('./config/db');

// const mongoose = require('mongoose');
// const passport = require('passport');

const app = express();

// Connect to MongoDB
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

const auth = require('./routes/api/auth');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');



// Passport middleware
// app.use(passport.initialize());

// // Passport Config
// require('./config/passport')(passport);

// Define routes
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);


const port = process.env.PORT || 4010;

app.listen(port, () => console.log(`Server running on port ${port}`));