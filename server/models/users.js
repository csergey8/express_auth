const mongoose = require('mongoose');


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

const User = mongoose.model('User', userSchema);


module.exports = { User };