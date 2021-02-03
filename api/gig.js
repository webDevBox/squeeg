const express = require('express');
const router = express.Router();
const conn = require('../db');


//Category Api

router.get('/category',(req,res)=>{

    conn.query('select CATID,name from categories where type=0 and status=0',(err,row)=>{
        if(!err && row.length > 0)
        {
            res.send({
                status:200,
                message: 'Record Found',
                category:row
            })
        }
        else
        {
            res.send({
                status:400,
                message: 'Record Not Found',
                category:[]
            })
        }
    })

});


//End


//SubCategory Api

router.get('/subcat?',(req,res)=>{
    conn.query('select CATID,name from categories where type=1 and status=0 and parent = ?',[req.query.category],(err,row)=>{
        
    })
})

//End


module.exports = router;