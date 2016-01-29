/* **********************
 * Passport Configuration
 * ********************** */

// =====
// Setup
// =====

// Core Modules
var generatePassword = require('password-generator'); // Load the Password Generator

// Passport Strategies
var LocalStrategy = require('passport-local').Strategy;

// App Modules
var User = require('../models/user'); // Load up the user model
var configAuth = require('./auth'); // Load the auth variables from auth.js

// =============
// Configuration
// =============

// Expose this function to our app using module.exports
module.exports = function(passport) {

	// ============
	// Local Signup
	// ============

	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'
	passport.use('local-signup', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, email, password, done) {

		// asynchronous
		// User.findOne won't fire unless data is sent back
		process.nextTick(function() {

			if(!req.user) {

			// find a user whose email is the same as the forms email
			// we are checking to see if the user trying to login already exists
				User.findOne({ 'local.email' :  email }, function(err, user) {
					// if there are any errors, return the error
					if (err)
						return done(err);

					// check to see if there's already a user with that email
					if (user) {
						return done(null, false, {'message': 'That email is already taken.'});
					} else {

						// if there is no user with that email
						// create the user
						var newUser = new User();

						// set the user's local credentials
						newUser.local.email    = email;
						newUser.local.password = newUser.generateHash(password);

						// save the user
						newUser.save(function(err) {
							if (err)
								throw err;
							return done(null, newUser);
						});
					}

				});

			} else {

				// If User is Logged In
				user = req.user;
				if(!user.local.password) {
					user.local.email = req.body.email;
					user.local.password = user.generateHash(req.body.password);

					// save the user
					user.save(function(err) {
						if (err)
							throw err;
						return done(null, user);
					});
				} else {
					return done(null, user);	
				}

			}

		});

	}));

	// ===========
	// Local Login
	// ===========

	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'
	passport.use('local-login', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, email, password, done) {

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
		User.findOne({ 'local.email' :  email }, function(err, user) {
			// if there are any errors, return the error before anything else
			if (err)
				return done(err);

			// if no user is found, return the message
			if (!user)
				return done(null, false, { message: 'Incorrect username.' })

			// if the user is found but the password is wrong
			if (!user.validPassword(password))
				return done(null, false, { message: 'Incorrect password.' });

			// all is well, return successful user
			return done(null, user);
		});

	}));

};