const express = require('express');
const bodyparser = require('body-parser');
const user = require('./api/user');

require('./db');

var app = express();

app.use(bodyparser.json());


//api call
app.use('/user',user);


app.listen(3000,()=>{
});