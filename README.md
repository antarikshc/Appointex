<h1 align="center">Appointex</h1>

<p align="center">
Making appointment booking between people a lot easier
</p>
</br>

## Installing

    $ npm install

## Running the project

Set your default config at `src/core/config.js`

OR

In your .env file:

    CONFIG_CLOCK_IN = 540
    CONFIG_CLOCK_OUT = 1020
    CONFIG_DURATION = 30
    CONFIG_TIME_ZONE = 330

Start project

    $ npm start

## Running Tests

    $ npm run test


## API

### GET /appointment/slots
Returns all available slots for booking within the time bounds 

    {
        "date": 1597379400000,  // current time in milliseconds
        "timeZoneOffset": 330   // (optional) local timezone in minutes, default UTC
    }

### POST /appointment/book
Books an appointment for the given start and end time

    {
        "name" : "John Doe",
        "startTime" : 1597375800000, // start time in milliseconds
        "endTime" : 1597377600000,  // end time in milliseconds
        "timeZoneOffset" : 330  // (optional) local timezone in minutes, default UTC
    }


### GET /event
Return all the events between given startTime & endTime

    {
        "startTime" : 1597375800000, // start time in milliseconds
        "endTime" : 1597377600000,  // end time in milliseconds
        "timeZoneOffset" : 330  // (optional) local timezone in minutes, default UTC
    }

> Note: IST GMT+5:30 == 330 minutes

## Built With

* [Node.js](https://nodejs.org/en/) - JavaScript Runtime
* [Express.js](https://expressjs.com/) - Web API Framework for Node.js
* [Firestore](https://firebase.google.com/docs/firestore) - NoSQL cloud database to store and sync
* [Express Validator](https://express-validator.github.io/docs/) - Express.js middlewares that wraps validator.js validator and sanitizer functions.
* [Jest](https://jestjs.io/) - JavaScript Testing Framework
