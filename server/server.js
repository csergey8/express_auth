const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {auth} = require('./middleware/auth');

const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth');

const { User } = require('./models/users');

const app = express();


//Everything is posted will convert to json
app.use(bodyParser.json());

//To read cookies
app.use(cookieParser());

//
app.post('/api/user', (req, res)  => {
  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  user.save((err, doc)=> {
    if (err) {
      res.status(400).send(err);
      console.log(err);
    }
    res.status(200).send(doc);
  });
});

app.post('/api/user/login', (req, res) => {
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    if(!user) {
      res.json({
        message: "user not found"
      });
    } else {
      user.comparePasswords(req.body.password, (err, isMatch) => {
        if(err) throw err;
        if(!isMatch) return res.status(400).json({ message: "Wrong password"});

        user.generateToken((err, user) => {
          if(err) return res.status(400).send(err);

          res.cookie('auth', user.token).status(200);
          res.send('ok');
        });
      });
    }
  })
})

app.get('/user/profile', auth,(req, res) => {
  res.status(200).send(req.token);
})













app.listen(port, () => {
  console.log(`Express started at port ${port}`);
})