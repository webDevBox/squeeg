const express = require('express');
const bodyparser = require('body-parser');
const user = require('./api/user');
const gig = require('./api/gig');
require('./db');

var app = express();

app.use(bodyparser.json());


//api call
app.use('/user',user);
app.use('/gig',gig);

app.listen(3000,()=>{
});