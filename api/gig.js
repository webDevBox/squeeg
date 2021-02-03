const express = require('express');
const router = express.Router();
const conn = require('../db');
var moment = require('moment');

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
    conn.query('select CATID,name,pro_ser from categories where type=1 and status=0 and parent = ?',[req.query.category],(err,row)=>{
        if(!err && row.length > 0)
        {
            res.send({
                status:200,
                message: 'Record Found',
                subCategory:row
            })
        }
        else
        {
            res.send({
                status:400,
                message: 'Record Not Found',
                subCategory:[]
            })
        }
    })
})

//End


//Buyer Request

router.post('/buyer?',(req,res)=>{
    var date = moment().format("YYYY-MM-DD");
    var time = moment().format("hh:mm");
   
    conn.query('insert into seller_offer(user_id,buyer_id,gig_id,request_id,revision,duration,description,budget,date,time,status) values(?,?,?,?,?,?,?,?,?,?,?)',[req.query.user,req.query.buyer,req.query.gig,req.query.request,req.query.revision,req.query.duration,req.query.description,req.query.budget,date,time,0],(err,row)=>{
        if(!err)
        {
            res.send({
                status:200,
                message: 'Offer Submitted'
            })
        }
        else
        {
            res.send({
                status:400,
                message: 'Offer Not Submitted'
            })
        }
    })
   
})

//End





module.exports = router;