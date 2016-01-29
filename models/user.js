/* **********
 * User Model
 * ********** */

// =====
// Setup
// =====
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// ======
// Schema
// ======
var userSchema = mongoose.Schema({

    local: {
        email:      String,
        password:   String,
        admin:      Boolean   
    }

});

// =======
// Methods
// =======

// Generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// ============
// Export Model
// ============

// Create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);