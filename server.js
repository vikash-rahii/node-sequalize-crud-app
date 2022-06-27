const express = require('express')
const app = express()
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const port = 3000;
const NODE_ENV = process.env.NODE_ENV || "production"
const dbConnection = require("./config/connection")
// const db = require("./models");
// db.sequelize.sync();


app.set("env", process.env);
global.NODE_ENV = app.get("env");

console.log(`Your env is ${process.env.NODE_ENV}`);
// console.log(`Your PORT is ${process.env.PORT}`);

const server = require('http').createServer(app);
//middleware
app.use(cors());
// app.use(dbConnection.sql());


app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));

app.use(morgan('dev'));
const reqStats = require("./logger/requestLogger");
app.use(reqStats());

//checking routes
app.get('/check', (req, res) => {
    res.send('API is working fine!')
});


//importing routes
app.use('/api/v1', require('./routes/tudoRoutes'));

//setting up custom error message for routes 
app.use((req, res, next) => {
    const error = new Error('This APIs does not exist');
    error.status = 404;
    next(error);
});

//Error handler function`
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

//cors
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});


//server calling
server.listen(port, () => {
    console.log(`Server is running at:${port}`)
});

