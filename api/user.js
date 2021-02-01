const express = require('express');
const router = express.Router();
const conn = require('../db');

router.get('/all',(req,res)=>{
conn.query('select * from user', (err,row)=>{
if(err){
    res.send({
        status:'400',
        user:[],
        message:err
    })

}

if(row.length > 0)
{
    res.send({
        status:'200',
        user:row,
        message:'success'
    })
}
});
});


router.get('/getUser?',(req,res)=>{

    conn.query('select name from user where id = ?',[req.query.id],(err,row)=>{
        if(err)
        {
            res.send({
                status: '400',
                user:[],
                message:err
            })
        }

        if(row.length > 0)
        {
            res.send({
                status:'200',
                user:row,
                message:'Success'
            })
        }
    })


});


router.get('/del?',(req,res)=>{

    var finder = conn.query('select * from user where id = ?',(req.query.id),(err,row)=>{
        if(finder.length == 0)
        {
            res.send({
                status:finder.length
            })
        }
        
    })

conn.query('delete from user where id = ?',(req.query.id),(err,row)=>{
    if(err)
    {
        res.send({
            status:'400',
            message:'Error: '+err
        })
    }
    else
    {
        res.send({
            status:'200',
            message:'Deleted'
        })
    }


})

});



module.exports = router;