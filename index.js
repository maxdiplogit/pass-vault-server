if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Utilities
const ExpressError = require('./utils/ExpressError');


// Routers
const userRouter = require('./routers/userRouter');
const serviceRouter = require('./routers/serviceRouter');


// Connecting to the database
const dbURL = process.env.MONGODB_CONNECTION_STRING;
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => {
        console.log('Mongoose Connection Open!');
    })
    .catch((err) => {
        console.log('Oh no! Mongoose Connection Error!');
        console.log(err);
    });


// Allowed Origins
const allowedOrigins = [ 'http://localhost:3000' ];


// Configurations
const corsConfig = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new ExpressError(401, 'Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
    credentials: true
};


// Creating express application
const app = express();


// Middlewares
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(cors(corsConfig));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


// APIs
app.get('/', (req, res) => {
    res.send({ status: 'success' });
});

app.use('/users', userRouter);
app.use('/service', serviceRouter);


// Error Handling Middlewares
app.use((err, req, res, next) => {
    const { message = 'Something Went Wrong', statusCode = 500 } = err;
    console.log('Middelware 1 message: ', statusCode);
    console.log('Middelware 1 message:\n', message);
    next(err);
});

app.use((err, req, res, next) => {
    console.log('Middleware 2:\n', err.name);
    console.log(err);
    next(err);
});


// Start the server
app.listen(8081, () => {
    console.log('Server started at port 8081...');
});