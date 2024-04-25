// only when deploying to server
if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}
// require('dotenv').config(); //use this in local in deployed server use the  upper part
const express = require('express');
const router = require('./routers');
const app = express();
const errorHandler = require('./middleware/ErrorHandler');

const cors = require('cors');
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Server is online!');
});
app.use(router);

app.use(errorHandler);
module.exports = app;
