const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT_I = 10;




const userSchema = mongoose.Schema({
  email: {
    type: String,
    require: true,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    require: true,
    minlenght: 6
  },
  token : {
    type: String
  }
});

// pre - is minnig run something before running
userSchema.pre('save', function(next) {
  var user = this;


  if(user.isModified('password')) {
    bcrypt.genSalt(SALT_I, function(err, salt) {
      if(err) return next(err);
  
      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return next(err);
  
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
  
});

//Own method to compare passwords
userSchema.methods.comparePasswords = function(canidatePassword, cb) {
  bcrypt.compare(canidatePassword, this.password, function(err, isMatch) {
    if(err) {
      throw cb(err);
    } else {
      cb(null, isMatch)
    }
  });
}

userSchema.methods.generateToken = function(cb) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), 'supersecret');

  user.token = token;
  user.save(function(err, user){
    if(err) return cb(err)
    cb(null, user);
  });
}

userSchema.statics.findByToken = function(token, cb) {
  const user = this;

  jwt.verify(token, 'supersecret', function(err, decode) {
    user.findOne({"_id": decode, "token": token}, function(err, user) {
      if(err) return cb(err);
      cb(null, user);
    })
  });
}

const User = mongoose.model('User', userSchema);


module.exports = { User };