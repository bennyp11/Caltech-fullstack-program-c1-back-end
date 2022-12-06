const express = require('express');
var cors = require('cors');
var indexRouter = require('./routes/index');
const dotenv = require("dotenv").config();

const PORT = 4000; //abstract this out to a .env later on
const app = express();
app.use(cors());
app.use(express.json());
app.use('/', indexRouter);



app.listen(PORT, () => {
    console.log('Node is running on port ' + PORT);
})