const express = require("express");
const mongoose = require('mongoose');
const handlebars = require("express-handlebars");
const cookieParser = require("cookie-parser");

const {auth} = require('./middlewares/authMiddleware')
const routes = require("./routes");
const path = require('path')

const PORT = 3000;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/magma-haven')
.then(()=> console.log("DB connected succesfully!"))
.catch(err => console.log("DB error", err.message))

app.engine('hbs', handlebars.engine({
    extname: 'hbs'
}))
app.set('view engine','hbs')
app.set('views', 'src/views')

app.use(express.static(path.resolve(__dirname, 'public'))) 
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(auth);
app.use(routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
