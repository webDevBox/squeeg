const mysql = require('mysql');

var conn = mysql.createConnection({

host:'localhost',
user:'root',
password:'',
database:'squeeg'

});


conn.connect((err)=>{
if(err)
{
    console.log(err.sqlMessage);
    return;
}
console.log('Connected');
})

module.exports = conn;