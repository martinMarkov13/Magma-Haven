const express = require("express");
const mongoose = require('mongoose');
const handlebars = require("express-handlebars");
const cookieParser = require("cookie-parser");

const { auth } = require('../src/middlewares/authMiddleware');
const routes = require("../src/routes");
const path = require('path');

const app = express();

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("DB connected successfully!"))
  .catch(err => console.log("DB error", err.message));

app.engine('hbs', handlebars.engine({
  extname: 'hbs',
}));
app.set('view engine', 'hbs');
app.set('views', path.join(process.cwd(), 'src', 'views'));

app.use(express.static(path.join(process.cwd(), 'src', 'public')));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(auth);
app.use(routes);

module.exports = app;
