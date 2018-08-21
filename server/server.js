const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/auth');

const { User } = require('./models/users');

const app = express();


//Everything is posted will convert to json
app.use(bodyParser.json());



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













app.listen(port, () => {
  console.log(`Express started at port ${port}`);
})