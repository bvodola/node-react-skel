// =====
// Setup
// =====

// Core Modules
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

// App Modules
var User = require('../models/user'); // Load up the user model

// ======
// Routes
// ======
module.exports = function(app, passport) {

	router.get('/', function(req, res) {
		res.render('index.ejs');
	});

	router.post('/login', function(req, res) {
	  passport.authenticate('local-login', function(err, user, info) {
		sendToken(app, req, res, err, user, info);
	  })(req, res);
	});

	router.post('/signup', function(req, res) {
	  passport.authenticate('local-signup', function(err, user, info) {
		sendToken(app, req, res, err, user, info);
	  })(req, res);
	});

	return router;
}

// ================
// Auxiliar Methods
// ================

/**
 * sendToken()
 * Receives req, res, err, user and info parameters
 * from the authentication proccess, verifies if
 * there was no error and generates the jwt Token
 */
function sendToken(app, req, res, err, user, info) {
	if (err)
			return done(err);

	if (!user)
		return res.json(401, { error: info });

	//user has authenticated correctly thus we create a JWT token
	var token = jwt.sign(user, app.get('jwtSecret'), {
		expiresInMinutes: 1440 // expires in 24 hours
	});

	// Sets the response to contain the token and a success confirmation.
	res.json({ 
		success: true,
		token : token
	});
}