/**
* index.js
* This is your main app entry point
*/

// Set up express, bodyparser and EJS
const express = require('express');
const app = express();
const port = 3000;
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // set the app to use ejs for rendering
app.use(express.static(__dirname + '/public')); // set location of static files

// Set up SQLite
// Items in the global namespace are accessible throught out the node application
const sqlite3 = require('sqlite3').verbose();
global.db = new sqlite3.Database('./database.db',function(err){
    if(err){
        console.error(err);
        process.exit(1); // bail out we can't connect to the DB
    } else {
        console.log("Database connected");
        global.db.run("PRAGMA foreign_keys=ON"); // tell SQLite to pay attention to foreign key constraints
    }
});

// Handle requests to the home page 
app.get('/', (req, res) => {
    //res.send('Hello World!')
    res.render("mainpage");
});

// ROUTES

// author home page
const authorRoute = require('./routes/author');
app.use('/author', authorRoute);

// blog settings page
const settingsRoute = require('./routes/settings');
app.use('/settings', settingsRoute);

// reader home page
const readerRoute = require('./routes/reader');
app.use('/reader', readerRoute);

// article page
const articleRoute = require('./routes/article');
app.use('/article', articleRoute);

// Make the web application listen for HTTP requests
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

