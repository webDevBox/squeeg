const express = require('express');
const router = express.Router();
const conn = require('../db');
var moment = require('moment');
var crypto = require('crypto');
var path = require('path')
const multer = require('multer');





var storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) return cb(err)

            cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
})

var upload = multer({ storage: storage })










//Category Api

router.get('/category', (req, res) => {

    conn.query('select CATID,name from categories where type=0 and status=0', (err, row) => {
        if (!err && row.length > 0) {
            res.send({
                status: 200,
                message: 'Record Found',
                category: row
            })
        }
        else {
            res.send({
                status: 400,
                message: 'Record Not Found',
                category: []
            })
        }
    })

});


//End


//SubCategory Api

router.get('/subcat?', (req, res) => {
    conn.query('select CATID,name,pro_ser from categories where type=1 and status=0 and parent = ?', [req.query.category], (err, row) => {
        if (!err && row.length > 0) {
            // =======

            // router.get('/subcat?', (req, res) => {
            //     conn.query('select CATID,name from categories where type=1 and status=0 and parent = ?', [req.query.category], (err, row) => {
            //         if (!err && row.length > 0) {
            // >>>>>>> 04b91297f588ca0467e02ca1389c5c2b8851191b
            res.send({
                status: 200,
                message: 'Record Found',
                subCategory: row
            })
        }
        else {
            res.send({
                status: 400,
                message: 'Record Not Found',
                subCategory: []
            })
        }

    })
})

//End







// create gig by selller
router.post('/create_gig_seller?', upload.single('image'), (req, res) => {
    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log('11');
    //const path = req.file.path;

    if (!req.query.fast_charges === '') {

        conn.query('insert into sell_gigs(user_id,title,gig_price,total_views,currency_type,cost_type,delivering_time,category_id,gig_details,super_fast_charges,super_fast_delivery,super_fast_delivery_date,work_option,vimeo_video_id,status,created_date,update_date,notification_status) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [req.query.user_id, req.query.title, req.query.gigprice, 0, req.query.curency_type, 1, req.query.delivery_time, req.query.category_id, req.query.detail, req.query.fast_charges, 'Yes', req.query.fast_date, 0, 0, 1, date, date, 1], (err, row) => {
            const path = req.file.path;
            var date = moment().format('YYYY-MM-DD HH:mm:ss');
            conn.query('SELECT * FROM sell_gigs ORDER BY ID DESC limit 1', (err, row33) => {

                conn.query('insert into gigs_image(gig_id,image_path,gig_image_thumb,gig_image_tile,gig_image_medium,created_date) values(?,?,?,?,?,?)', [row33[0].id, path, path, path, path, date], (err, row1) => {



                    if (!err) {

                        res.send({
                            status: 200,
                            message: 'gig inserted'
                        })


                    }
                    else {
                        res.send({
                            status: 400,
                            message: 'gig not inserted'
                        })
                    }



                })
            })
        })

    }
    else {
        conn.query('insert into sell_gigs(user_id,title,gig_price,total_views,currency_type,cost_type,delivering_time,category_id,gig_details,super_fast_delivery,work_option,vimeo_video_id,status,created_date,update_date,notification_status) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [req.query.user_id, req.query.title, req.query.gigprice, 0, req.query.curency_type, 1, req.query.delivery_time, req.query.category_id, req.query.detail, 'No', 0, 0, 1, date, date, 1], (err, row) => {
            const path = req.file.path;
            var date = moment().format('YYYY-MM-DD HH:mm:ss');
            conn.query('SELECT * FROM sell_gigs ORDER BY ID DESC limit 1', (err, row33) => {

                conn.query('insert into gigs_image(gig_id,image_path,gig_image_thumb,gig_image_tile,gig_image_medium,created_date) values(?,?,?,?,?,?)', [row33[0].id, path, path, path, path, date], (err, row1) => {


                    if (!err) {
                        res.send({
                            status: 200,
                            message: 'gig inserted'
                        })
                    }
                    else {
                        console.log(err);
                        res.send({
                            status: 400,
                            message: 'gig not inserted'
                        })
                    }

                })
            })
        })



    }

})

//end


//Buyer Request

router.post('/buyer?', (req, res) => {
    var date = moment().format("YYYY-MM-DD");
    var time = moment().format("hh:mm");
    conn.query('select * from seller_offer where user_id = ? and request_id = ?', [req.query.user, req.query.request], (err, row33) => {

        if (row33.length > 0) {

            res.send({
                status: 200,
                message: 'Offer already Submitted',
                offer: 1
            })

        }
        else {

            conn.query('insert into seller_offer(user_id,buyer_id,gig_id,request_id,revision,duration,description,budget,date,time,status) values(?,?,?,?,?,?,?,?,?,?,?)', [req.query.user, req.query.buyer, req.query.gig, req.query.request, req.query.revision, req.query.duration, req.query.description, req.query.budget, date, time, 0], (err, row) => {
                conn.query('select no_of_offers from buyer_request where sno = ?', [req.query.request], (err, row11) => {
                    if (row11.length > 0) {
                        const add = row11[0].no_of_offers + 1;
                        conn.query('update buyer_request set no_of_offers=? where sno=?', [add, req.query.request], (err, row111) => {
                            console.log(add);
                        })

                    }
                    else {

                        conn.query('update buyer_request set no_of_offers=? where sno=?', [0, req.query.request], (err, row111) => {
                            console.log('0');
                        })
                    }
                })
                if (!err) {
                    res.send({
                        status: 200,
                        message: 'Offer Submitted',
                        offer: 0
                    })
                }
                else {
                    res.send({
                        status: 400,
                        message: 'Offer Not Submitted'
                    })
                }
            })
        }
    })

})

//End











//UPLOAD GIG IMAGE

router.post('/uploadgig', upload.single('image'), (req, res) => {
    if (req.file) {

        const path = req.file.path;
        var date = moment().format('YYYY-MM-DD HH:mm:ss');
        conn.query('SELECT * FROM sell_gigs ORDER BY ID DESC limit 1', (err, row33) => {

            conn.query('insert into gigs_image(gig_id,image_path,gig_image_thumb,gig_image_tile,gig_image_medium,created_date) values(?,?,?,?,?,?)', [row33[0].id, path, path, path, path, date], (err, row1) => {


                if (!err) {

                    res.send({
                        status: 200,
                        message: 'picture uploaded',
                    })
                } else {
                    res.send({
                        status: 400,
                        message: 'not uploaded',
                        err: err
                    })
                }

            })
        })
    }
});

//end


//user gigs

router.get('/allgigs?', (req, res) => {
    conn.query('select * from sell_gigs where user_id =?', [req.query.id], (err1, row12) => {
        if (row12.length > 0) {

            res.send({
                status: 200,
                gigs: row12
            })

        }
        else {
            res.send({
                status: 400,
                gigs: []
            })
        }
    })


});
//end


//user gigs

router.get('/gigs?', (req, res) => {

    conn.query('select sell_gigs.id,favourites.gig_id as favourites,sell_gigs.user_id,sell_gigs.title,sell_gigs.gig_price,sell_gigs.total_views,sell_gigs.currency_type,sell_gigs.cost_type,sell_gigs.delivering_time,sell_gigs.gig_tags,sell_gigs.category_id,sell_gigs.gig_details,sell_gigs.super_fast_charges,sell_gigs.super_fast_delivery_desc,sell_gigs.super_fast_delivery_date,sell_gigs.requirements,sell_gigs.youtube_url,sell_gigs.vimeo_url,sell_gigs.created_date,gigs_image.image_path,feedback.rating from sell_gigs LEFT join gigs_image on sell_gigs.id = gigs_image.gig_id LEFT JOIN feedback on sell_gigs.id = feedback.gig_id LEFT JOIN favourites on sell_gigs.id = favourites.gig_id', (err1, row12) => {
        if (row12.length > 0) {


            res.send({
                status: 200,
                gigs: row12
            })
        }
        else {
            res.send({
                status: 400,
                gigs: []
            })
        }
    })


});
//end

//favourit gigs


router.get('/favourite_gigs?', (req, res) => {

    conn.query('select sell_gigs.id,favourites.gig_id as favourites,sell_gigs.user_id,sell_gigs.title,sell_gigs.gig_price,sell_gigs.total_views,sell_gigs.currency_type,sell_gigs.cost_type,sell_gigs.delivering_time,sell_gigs.gig_tags,sell_gigs.category_id,sell_gigs.gig_details,sell_gigs.super_fast_charges,sell_gigs.super_fast_delivery_desc,sell_gigs.super_fast_delivery_date,sell_gigs.requirements,sell_gigs.youtube_url,sell_gigs.vimeo_url,sell_gigs.created_date,gigs_image.image_path,feedback.rating from favourites LEFT JOIN sell_gigs on favourites.gig_id = sell_gigs.id LEFT join gigs_image on sell_gigs.id = gigs_image.gig_id LEFT JOIN feedback on feedback.gig_id=sell_gigs.id where favourites.user_id = ? ',[req.query.id], (err1, row12) => {
   console.log(err1);     
        if (row12.length > 0) {


            res.send({
                status: 200,
                gigs: row12
            })
        }
        else {
            res.send({
                status: 400,
                gigs: []
            })
        }
    })


});
//end


//popular gigs

router.get('/popular_gigs?', (req, res) => {

    conn.query('select sell_gigs.id,favourites.gig_id,sell_gigs.user_id,sell_gigs.title,sell_gigs.gig_price,sell_gigs.total_views,sell_gigs.currency_type,sell_gigs.cost_type,sell_gigs.delivering_time,sell_gigs.gig_tags,sell_gigs.category_id,sell_gigs.gig_details,sell_gigs.super_fast_charges,sell_gigs.super_fast_delivery_desc,sell_gigs.super_fast_delivery_date,sell_gigs.requirements,sell_gigs.youtube_url,sell_gigs.vimeo_url,sell_gigs.created_date,gigs_image.image_path,feedback.rating from sell_gigs LEFT join gigs_image on sell_gigs.id = gigs_image.gig_id LEFT JOIN feedback on sell_gigs.id = feedback.gig_id LEFT JOIN favourites on sell_gigs.id = favourites.gig_id where feedback.rating>=4', (err1, row12) => {
        if (row12.length > 0) {

            res.send({
                status: 200,
                gigs: row12
            })

        }
        else {
            res.send({
                status: 400,
                gigs: []
            })
        }
    })


});
//end



//latest gigs

router.get('/latest_gigs?', (req, res) => {

    dateFrom = moment().subtract(7, 'd').format('YYYY-MM-DD');


    conn.query('select sell_gigs.id,favourites.gig_id,sell_gigs.user_id,sell_gigs.title,sell_gigs.gig_price,sell_gigs.total_views,sell_gigs.currency_type,sell_gigs.cost_type,sell_gigs.delivering_time,sell_gigs.gig_tags,sell_gigs.category_id,sell_gigs.gig_details,sell_gigs.super_fast_charges,sell_gigs.super_fast_delivery_desc,sell_gigs.super_fast_delivery_date,sell_gigs.requirements,sell_gigs.youtube_url,sell_gigs.vimeo_url,sell_gigs.created_date,gigs_image.image_path,feedback.rating from sell_gigs LEFT join gigs_image on sell_gigs.id = gigs_image.gig_id LEFT JOIN feedback on sell_gigs.id = feedback.gig_id LEFT JOIN favourites on sell_gigs.id = favourites.gig_id  where sell_gigs.created_date>?', [dateFrom], (err1, row12) => {
        if (row12.length > 0) {

            res.send({
                status: 200,
                gigs: row12
            })

        }
        else {
            res.send({
                status: 400,
                gigs: []
            })
        }
    })


});
//end


//seller offers on buyer request

router.get('/alloffers?', (req, res) => {
    conn.query('select members.username,seller_offer.user_id,members.description,members.profilepicture,seller_offer.sno,seller_offer.revision,seller_offer.duration,seller_offer.description,seller_offer.budget,sell_gigs.id,sell_gigs.title,sell_gigs.gig_details,gigs_image.image_path from seller_offer left JOIN sell_gigs on seller_offer.gig_id=sell_gigs.id left join gigs_image on sell_gigs.id=gigs_image.gig_id left join members on seller_offer.user_id = members.USERID where seller_offer.request_id=?', [req.query.id], (err1, row12) => {
        if (row12.length > 0) {

            res.send({
                status: 200,
                offers: row12
            })

        }
        else {
            res.send({
                status: 400,
                offers: []
            })
        }
    })


});
//end

//





module.exports = router;