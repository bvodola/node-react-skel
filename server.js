// =====
// Setup
// =====

// Core Modules
var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var request = require('request');
var passport = require('passport');
var jwt = require('jsonwebtoken');

// App Modules
var app = express();
var config = require('./config');
var databaseConfig = require('./config/database.js');

// Routing Modules
var routes = require('./routes')(app, passport);
var apiRoutes = require('./routes/api')(app, passport);

// =============
// Configuration
// =============
mongoose.connect(databaseConfig.url);
require('./config/passport')(passport);
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('jwtSecret', config.secret);

// ==========
// Middleware
// ==========
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * verifyToken()
 * Route Middleware that validates the jwt module
 * token sent by the user. Used in the API Middleware.
 */
function verifyToken(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('jwtSecret'), function(err, decoded) {      	
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
};

// ======
// Routes
// ======
app.use('/', routes);
app.use('/api', verifyToken, apiRoutes);

// ============
// Start Server
// ============
var server = http.createServer(app);
server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});