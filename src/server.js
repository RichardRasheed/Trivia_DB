// use the express library
const express = require('express');

// use the cookie parser
const cookieParser = require('cookie-parser');

// create a new server application
const app = express();

// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;


//adding node fetch to our implementation
const fetch = require('node-fetch');

// set the view engine to ejs
app.set('view engine', 'ejs');

// adding the cookie parser to the app
app.use(cookieParser());


//This is the folder where we will store public files, notably css
app.use(express.static('public'));



//set up for cookies
let nextVisitorId = 1;
nextVisitorId += 1;

//use lastVisit with cookies to calculate time of last visit
let currentTime = Date.now().toString();

app.get('/', (req, res) => {
  res.cookie('visitorId', nextVisitorId);
  res.cookie('visited', Date.now().toString());
  res.render('welcome', {
    name: req.query.name || "Richard",
    date: new Date().toLocaleString(),
    timeofLastVisit: Math.floor((Date.now().toString() - req.cookies.visited) /1000),
    whoIsVisitor: req.cookies.visitorId,

  });
  console.log(req.cookies);
});


//adding more to the trivia endpoint
app.get("/trivia", async (req, res) => {
  // fetch the data
  const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");

  // fail if bad response
  if (!response.ok) {
    res.status(500);
    res.send(`Open Trivia Database failed with HTTP code ${response.status}`);
    return;
  }

  // interpret the body as json
  const content = await response.json();

  // fail if db failed
  if (response.response_code !== 0) {
    res.status(500);
    res.send(`Open Trivia Database failed with internal response code ${response.response_code}`);
    return;
  }

  // respond to the browser
  // TODO: make proper html
  res.render('trivia');
});

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");