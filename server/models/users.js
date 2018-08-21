const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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

const User = mongoose.model('User', userSchema);


module.exports = { User };