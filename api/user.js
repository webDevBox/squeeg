const express = require('express');
const router = express.Router();
const conn = require('../db');
const md5 = require('md5');




//login api
router.post('/login?',(req,res)=>{

conn.query('select * from members where email = ?',[req.query.email],(err,row)=>{
if(row.length > 0)
{
    const pass = md5(req.query.password);
    
    conn.query('select * from members where email = ? and password = ?',[req.query.email,pass],(err1,row1)=>{

        if(row1.length>0){
            conn.query('update members set status = 0 where email = ?',[req.query.email],(err1,row2)=>{
            
            res.send({
                status:'200',
                message:'loggin',
                user:row1
            })
        })
        }else{
            res.send({
                status:'400',
                message:'password invalid'
            })
        }

    })
}
else{
    conn.query('select * from members where username = ?',[req.query.email],(err,row)=>{
        if(row.length > 0)
        {
            const pass = md5(req.query.password);
            
            conn.query('select * from members where username = ? and password = ?',[req.query.email,pass],(err1,row1)=>{
        
                if(row1.length>0){
                    
                    conn.query('update members set status = 0 where username = ?',[req.query.email],(err1,row2)=>{
            
                        res.send({
                            status:'200',
                            message:'loggin',
                            user:row1
                        })
                    })
                }else{
                    res.send({
                        status:'400',
                        message:'password invalid'
                    })
                }
        
            })
        }else{

            res.send({
                status:'400',
                message:'email and password not exist'
            })  
        }

})

}
})

});
//end





module.exports = router;