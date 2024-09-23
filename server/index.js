const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoute = require('./routes/user');
const postRoute = require('./routes/post')

require('dotenv').config();


const app = express ();

mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once('open', () => console.log('MongoDB Connected'))

app.use(cors({
    origin: 'http://localhost:3000', // Adjust this to match your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type']
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/users', userRoute);
app.use('/posts', postRoute);

if(require.main === module) {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`API is now online on port ${ process.env.PORT }` || 3000)
    });
}

module.exports = { app, mongoose };