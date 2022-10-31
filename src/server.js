// use the express library
const express = require('express');

// use the cookie parser
const cookieParser = require('cookie-parser');

// create a new server application
const app = express();

//adding node fetch to our implementation
const fetch = require('node-fetch');

// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;


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
  const data = await response.json();

  // fail if db failed
  if (data.response_code !== 0) {
    res.status(500);
    res.send(`Open Trivia Database failed with internal response code ${data.response_code}`);
    return;
  }

  // respond to the browser
  // TODO: make proper html



  //creating real HTML now
  const correctAnswer = data.results[0].correct_answer;
  const answers = [data.results[0].incorrect_answers,correctAnswer];
  const answerLinks = answers.map(answer => {
    return `<a href="javascript:alert('${
      answer === correctAnswer ? 'Correct!' : 'Incorrect, Please Try Again!'
      }')">${answer}</a>
    `
  })


  res.render('trivia',{
    question: data.results[0].question,
    answerLinks,
    correct_answer: data.results[0].correct_answer,
    answers: data.results[0].incorrect_answers,
    category: data.results[0].category,
    difficulty: data.results[0].difficulty
  })
});

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");