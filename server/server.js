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













app.listen(port, () => {
  console.log(`Express started at port ${port}`);
})