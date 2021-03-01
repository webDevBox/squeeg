const express = require('express');
const bodyparser = require('body-parser');
const user = require('./api/user');
const gig = require('./api/gig');
const conn = require('./db');

require('./db');

var app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http);


io.on('connection', function (socket) {
    console.log('A user connected');
    socket.on("chat message", msg => {

       // console.log(ab);
            console.log(msg);

        conn.query('insert into chats(chat_from,chat_to,content,status) values(?,?,?,?)', [msg.chat_from, msg.chat_to,msg.content, 0], (err, row) => {
console.log(err);
console.log('not');

var a = msg.chat_from;
var b = msg.chat_to;
            var ab = a+""+b;
            console.log(ab);
            console.log(msg)
          
            io.emit(ab, msg);

        })

    });
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
});

app.use(bodyparser.json());

app.get('/emit?',(req,res)=>{
var msg = "hfwefwejwj";

    io.emit("chat message",msg);
    
})

//api call
app.use('/user',user);
app.use('/gig',gig);

http.listen(3000,()=>{
});