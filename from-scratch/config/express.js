import { Session } from 'inspector';
import { request } from 'https';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const passport = require('passport');

module.exports = (app, config) =>
{
    // view engine setup.
    app.set('views', path.join(config.rootFolder, '/views'));
    app.set('view engine', 'hbs');

    // This makes the content in the "public" folder accessible for every user.
    app.use(express.static(path.join(config.rootFolder, '/public')));

    // This set up which is the parser for the request&#39;s data.
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // We will use cookies.
    app.use(cookieParser('softUniBlog'))

    // Session is storage for cookies, which will be en/decrypted with that 'secret' key.
    app.use(session({ secret: 'youWillNeverGuessThis', resave: false, saveUninitialized: false }));

    // For user validation we will use passport module.
    app.use(passport.initialize());
    app.use(passport.session());

    app.use((request, response, next) =>
    {
        if (request.user)
        {
            response.locals.user = request.user;
        }
        next();
    });
};