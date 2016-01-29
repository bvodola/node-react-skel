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

	// API Welcome Route
	router.get('/', function(req, res){
		res.send(req.decoded);
	});

	return router;
}