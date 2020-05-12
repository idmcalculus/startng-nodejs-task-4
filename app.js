const express = require('express');
const bodyParser = require('body-parser');
const users = require('./routes/user');
const dotenv = require('dotenv');
require('./models/db');

dotenv.config();
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/api/v1', users);

app.get('/', (req, res) => {
    res.send(`Welcome to my NodeJs StartNg Tutorial. Check my github page <a href="https://github.com/idmcalculus" style="color: blue">here</a>`);
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}...`);
});

module.exports = app;