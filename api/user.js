const express = require('express');
const router = express.Router();
const conn = require('../db');
const md5 = require('md5');
var moment = require('moment');
const multer = require('multer');
var nodemailer = require('nodemailer');
var fs = require('fs');
var crypto = require('crypto');
var path = require('path');
const { Console } = require('console');



//login api
router.post('/login?', (req, res) => {



    conn.query('select * from members where email = ?', [req.query.email], (err, row) => {
        if (row.length > 0) {
            const pass = md5(req.query.password);
            conn.query('select * from members where email = ? and password = ? ', [req.query.email, pass], (err1, row1) => {

                if (row1.length > 0) {
                    if (row1[0].verified == 0) {
                        conn.query('update members set status = 0 where email = ?', [req.query.email], (err1, row2) => {
                            conn.query('select country from country where id = ?', [row1[0].country], (err, row121) => {
                                conn.query('select state_name from states where state_id = ?', [row1[0].state], (err, row122) => {
                                    conn.query('select city_name from cities where city_id = ?', [row1[0].city], (err, row123) => {

                                        var new1 = [].concat(row121,row122,row123);
                                      
                                        var new11 = [...row1,...new1];

                                        console.log(new11);

                                        res.send({
                                            status: 200,
                                            message: 'loggin',
                                            user: new11,
                                            
                                        })
                                    })
                                })
                            })


                        })
                    }
                    else {
                        var otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);

                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'digitalinnovation13@gmail.com',
                                pass: 'Allahisgreate'
                            }
                        });

                        var mailOptions = {
                            from: 'digitalinnovation13@gmail.com',
                            to: req.query.email,
                            subject: 'Account Verification',
                            html: '<html><body><center> <h3>Here is your otp</h3><h4>' + otp + '</h4> </center></body></html>'
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });

                        conn.query('update members set otp = ? where email = ?', [otp, req.query.email], (err1, row222) => {
                            if (!err) {

                                res.send({
                                    status: 300,
                                    message: 'otp sent successfully',
                                })
                            }
                            else {
                                res.send({
                                    status: 400,
                                    message: 'failed',
                                })
                            }
                        })


                    }
                } else {
                    res.send({
                        status: 400,
                        message: 'password invalid'
                    })
                }

            })
        }
        else {
            conn.query('select * from members where username = ?', [req.query.email], (err, row) => {
                if (row.length > 0) {
                    const pass = md5(req.query.password);

                    conn.query('select * from members where username = ? and password = ? and status = 0', [req.query.email, pass], (err1, row1) => {

                        if (row1.length > 0) {
                            if (row1[0].verified == 0) {
                                conn.query('update members set status = 0 where username = ?', [req.query.email], (err1, row2) => {

                                    res.send({
                                        status: 200,
                                        message: 'loggin',
                                        user: row1[0]
                                    })
                                })
                            }
                            else {
                                var otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);

                                var transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                        user: 'digitalinnovation13@gmail.com',
                                        pass: 'Allahisgreate'
                                    }
                                });

                                var mailOptions = {
                                    from: 'digitalinnovation13@gmail.com',
                                    to: req.query.email,
                                    subject: 'Account Verification',
                                    html: '<html><body><center> <h3>Here is your otp</h3><h4>' + otp + '</h4> </center></body></html>'
                                };

                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                    }
                                });

                                conn.query('update members set otp = ? where email = ?', [otp, req.query.email], (err1, row222) => {
                                    if (!err) {

                                        res.send({
                                            status: 300,
                                            message: 'otp sent successfully',
                                        })
                                    }
                                    else {
                                        res.send({
                                            status: 400,
                                            message: 'failed',
                                        })
                                    }
                                })


                            }
                        } else {
                            res.send({
                                status: 400,
                                message: 'password invalid'
                            })
                        }

                    })
                } else {

                    res.send({
                        status: 400,
                        message: 'email and password not exist'
                    })
                }

            })

        }
    })

});
//end

//Register
router.post('/signup?', (req, res) => {
    var pass = md5(req.query.password);
    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    //const upload = multer({dest:'uploads/'}).single(req.query.image);
    conn.query('select * from members where email=? or username=?', [req.query.email, req.query.username], (err, row11) => {

        if (row11.length > 0) {
            res.send({
                status: 400,
                message: 'email or user already exist',
            })


        }
        else {
            var otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
            conn.query('INSERT INTO members(email,username,password,fullname,verified,status,country,state,city,user_timezone,created_date,otp) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', [req.query.email, req.query.username, pass, req.query.fullname, 1, 1, req.query.country, req.query.state, req.query.city, req.query.user_timezone, date, otp], (err, row) => {


                if (!err) {
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'digitalinnovation13@gmail.com',
                            pass: 'Allahisgreate'
                        }
                    });

                    var mailOptions = {
                        from: 'digitalinnovation13@gmail.com',
                        to: req.query.email,
                        subject: 'Account Verification',
                        html: '<html><body><center> <h3>Here is your otp</h3><h4>' + otp + '</h4> </center></body></html>'
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                    // =======
                    //                 if (!err) {


                    //                     var transporter = nodemailer.createTransport({
                    //                         service: 'gmail',
                    //                         auth: {
                    //                             user: 'digitalinnovation13@gmail.com',
                    //                             pass: 'Allahisgreate'
                    //                         }
                    //                     });

                    //                     var mailOptions = {
                    //                         from: 'digitalinnovation13@gmail.com',
                    //                         to: req.query.email,
                    //                         subject: 'Account Verification',
                    //                         html: '<html><body><center> <h3>Here is your otp</h3><h4>' + otp + '</h4> </center></body></html>'
                    //                     };

                    //                     transporter.sendMail(mailOptions, function (error, info) {
                    //                         if (error) {
                    //                             console.log(error);
                    //                         } else {
                    //                             console.log('Email sent: ' + info.response);
                    //                         }
                    //                     });
                    // >>>>>>> 04b91297f588ca0467e02ca1389c5c2b8851191b



                    res.send({
                        status: 200,
                        message: 'user registered',
                    })
                } else {
                    res.send({
                        status: 400,
                        message: 'failed',
                        err: err
                    })
                }

            })
        }
    })

});
//end


//social register

router.post('/socialsignup?', (req, res) => {

    var ab = '12345678';
    var pass = md5(ab);
    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    conn.query('select * from members where email=? or username=?', [req.query.email, req.query.username], (err, row11) => {

        if (row11.length > 0) {

            conn.query('select * from members where email = ? and password = ? ', [req.query.email, pass], (err1, row1) => {

                if (row1.length > 0) {


                    res.send({
                        status: 200,
                        message: 'loggin',
                        user: row1[0]
                    })
                }
                else {
                    res.send({
                        status: 400,
                        message: 'loggin failed use an other account',
                        user: []
                    })


                }


            })

        }
        else {
            conn.query('INSERT INTO members(email,password,verified,status,created_date) VALUES(?,?,?,?,?)', [req.query.email, pass, 0, 0, date], (err, row) => {
                conn.query('select * from members where email = ?', [req.query.email], (err, ress) => {


                    if (!err) {

                        res.send({
                            status: 200,
                            message: 'user registered',
                            user: ress[0]
                        })
                    } else {
                        res.send({
                            status: 400,
                            message: 'failed',
                            user: []
                        })
                    }

                })
            })

        }
    })

});
//end

//forget passwor

router.post('/forget?', (req, res) => {
    conn.query('select * from members where email=? or username=?', [req.query.email, req.query.username], (err, row11) => {

        if (row11.length == 0) {
            res.send({
                status: 400,
                message: 'email not valid',
            })


        }
        else {
            var otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'digitalinnovation13@gmail.com',
                    pass: 'Allahisgreate'
                }
            });

            var mailOptions = {
                from: 'digitalinnovation13@gmail.com',
                to: req.query.email,
                subject: 'Forget Password by Squeeg',
                html: '<html><body><center> <h3>Here is your otp</h3><h4>' + otp + '</h4>   </center></body></html>'
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });



            conn.query('update members set otp=? where email=?', [otp, req.query.email], (err, row) => {

                if (!err) {

                    res.send({
                        status: 200,
                        message: 'otp send',
                    })
                } else {
                    res.send({
                        status: 400,
                        message: 'failed'
                    })
                }

            })
        }
    })

});

//end

//validate otp

//profile update

router.put('/profileupdate?', (req, res) => {

    // if (!req.query.password == '') {
    //     const pass = md5(req.query.password);

    //     conn.query('UPDATE members SET email=?, username=?, password=?, fullname=?, country=?, state=?, city=? WHERE USERID=?', [req.query.email, req.query.username, pass, req.query.fullname, req.query.country, req.query.state, req.query.city, req.query.id], (err, row) => {

    //         if (!err) {
    //             res.send({

    //                 status: 200,
    //                 message: 'profile updated'
    //             })
    //         }
    //         else {

    //             res.send({
    //                 status: 400,
    //                 message: 'failed'
    //             })
    //         }

    //     })
    // }
    // else {
        conn.query('UPDATE members SET username=?, fullname=?, country=?, state=?, city=? WHERE USERID=?', [req.query.username, req.query.fullname, req.query.country, req.query.state, req.query.city, req.query.id], (err, row) => {

            if (!err) {
                res.send({

                    status: 200,
                    message: 'profile updated'
                })
            }
            else {

                res.send({
                    status: 400,
                    message: 'failed'
                })
            }

        })

    //}


})

//end


//change password

router.put('/changepassword?', (req, res) => {


    const pass = md5(req.query.password);
    conn.query('update members set password=? where email=?', [pass, req.query.email], (err, row) => {

        if (!err) {

            res.send({
                status: 200,
                message: 'password change successfully',
            })

        }

    })

});

//end


//change password

router.put('/logout?', (req, res) => {

    conn.query('update members set status=? where email=?', [1, req.query.email], (err, row) => {

        if (!err) {

            res.send({
                status: 200,
                message: 'logout successfully',
            })

        }

    })

});

//end



//Update Profile

router.put('/updateprofile?', (req, res) => {
    conn.query('select * from members where email=?', [req.query.email], (err1, row12) => {
        if (row12.length > 0) {
            conn.query('update members set fullname=?, description=?, contact=?, address=?, zipcode=?, lang_speaks=?, country=?, state=?, city=? where email=?', [req.query.fullname, req.query.description, req.query.contact, req.query.address, req.query.zipcode, req.query.lang, req.query.address, req.query.country, req.query.state, req.query.city, req.query.email], (err, row) => {

                if (!err) {
                    res.send({
                        status: 200,
                        message: 'Profile Updated Successfully'
                    })
                }
            })
        }
        else {
            res.send({
                status: 400,
                message: 'User Not Exist'
            })
        }
    })


});
//end


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

//const upload = multer({dest:'./uploads'});
//file upload

router.post('/upload', upload.single('image'), (req, res) => {
    if (req.file) {

        const path = req.file.path;
        conn.query('update members set user_thumb_image=?, user_profile_image=?, profilepicture=? where email=?', [path, path, path, req.query.email], (err, row) => {

            if (!err) {

                res.send({
                    status: 200,
                    message: 'picture uploaded',
                })
            } else {
                res.send({
                    status: 400,
                    message: 'not uploaded'
                })
            }

        })


    }
});

//end



//Country Api

router.get('/country', (req, res) => {
    conn.query('select id,country from country', (err, row) => {
        if (!err && row.length > 0) {
            res.send({
                status: 200,
                message: 'Record Found',
                country: row
            })
        }
        else {
            res.send({
                status: 400,
                message: 'Record Not Found',
                country: []
            })
        }
    })
});

//End


//State Api

router.get('/state?', (req, res) => {
    conn.query('select state_id,state_name from states where country_id = ?', [req.query.country], (err, row) => {
        if (!err && row.length > 0) {
            res.send({
                status: 200,
                message: 'Record Found',
                state: row
            })
        }
        else {
            res.send({
                status: 400,
                message: 'Record Not Found',
                state: []
            })
        }
    })
});

//End


//City Api

router.get('/city?', (req, res) => {

    conn.query('select city_id,city_name from cities where state_id=?', [req.query.state], (err, row) => {
        if (!err && row.length > 0) {
            res.send({
                status: 200,
                message: 'Record Found',
                city: row
            })
        }
        else {
            res.send({
                status: 400,
                message: 'Record Not Found',
                city: []
            })
        }
    })

});

//End

//my services

router.get('/myservices?', (req, res) => {
    conn.query('select * from sell_gigs where user_id=?', [req.query.id], (err1, row12) => {
        if (row12.length > 0) {

            res.send({
                status: 200,
                services: row12
            })

        }
        else {
            res.send({
                status: 400,
                services: []
            })
        }
    })


});
//end


//chat between users


router.post('/chat?', upload.single('file'), (req, res) => {
    // console.log(req.file.path);

    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    conn.query('insert into chats(chat_from,chat_to,content,file_path,chat_type,date_time,chat_from_time,chat_to_time,chat_utc_time,timezone,from_delete_sts,to_delete_sts,status) values(?,?,?,?,?,?,?,?,?,?,?,?,?)', [req.query.chat_from, req.query.chat_to, req.query.content, req.file.path, 1, date, req.query.chat_from_time, req.query.chat_to_time, req.query.chat_utc_time, req.query.timezone, 0, 0, 0], (err, row) => {

        if (!err) {

            res.send({
                status: 200,
                message: 'chat sent to user successfully'
            })

        }
        else {
            res.send({
                status: 400,
                message: 'chat not send',
                err: err
            })
        }

    })


})
//end


//users inbox

router.get('/user_inbox?', (req, res) => {

    conn.query('select chats.chat_from,members.user_profile_image,members.username,chats.content,chats.status,chats.date_time from chats left JOIN members on chats.chat_from_time = members.USERID where chats.chat_to = ?  GROUP BY chats.chat_from ORDER BY chats.date_time DESC', [req.query.id], (err, row) => {

        if (row.length > 0) {

            res.send({
                status: 200,
                chats: row
            })
        }
        else {
            res.send({
                status: 400,
                chats: []
            })
        }


    })

})

//end

//create buyer request

router.post('/create_request?', upload.single('image'), (req, res) => {

    const path = req.file.path;

    // console.log(req);
    conn.query('INSERT INTO buyer_request(USERID,description,category_id,quantity,size,color_id,location,shipment,delivery_time,requested_image_url,requested_image,date,time,no_of_offers,status,country,state,city) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [req.query.user_id, req.query.description, req.query.category_id, req.query.quantity, req.query.size, req.query.color_id, req.query.location, req.query.shipment, req.query.delivery_time, path, path, req.query.date, req.query.time, 0, 0, req.query.country, req.query.state, req.query.city], (err, row) => {

        if (!err) {

            res.send({
                status: 200,
                message: 'request created successfully'
            })
        }
        else {

            res.send({

                status: 400,
                message: 'failed',
                err: err
            })
        }
    })

})

//end

//colors

router.get('/colors', (req, res) => {

    conn.query('select * from  colors', (err, row) => {
        if (row.length > 0) {
            res.send({
                status: 200,
                colors: row
            })
        }
        else {
            res.send({
                status: 400,
                colors: []
            })
        }
    })
})

//end

//all request for seller

router.get('/all_request_for_seller?', (req, res) => {

    conn.query('select category_id from sell_gigs where user_id = ? group by category_id', [req.query.id], (err, row22) => {

        if (row22.length > 0) {
            var arr = [];
            for (let i = 0; i < row22.length; i++) {

                conn.query('select members.username,members.profilepicture,buyer_request.sno,buyer_request.description,buyer_request.created,buyer_request.requested_image_url,buyer_request.no_of_offers,buyer_request.delivery_time from buyer_request LEFT JOIN members on buyer_request.USERID = members.USERID where buyer_request.status=0 and buyer_request.category_id = ?', [row22[i].category_id], (err, row) => {


                    if (row.length > 0) {
                        arr.push(row);

                    }



                    if (row22.length - 1 == i) {
                        res.send({
                            status: 200,
                            request: arr
                        })
                    }

                })

            }
        }
        else {

            res.send({
                status: 400,
                message: 'you are not allowed because you have not created any gig'
            })
        }

    })


})


//end

//accept offer by buyer

router.put('/accept_offer?', (req, res) => {

    conn.query('UPDATE seller_offer SET status=1 WHERE request_id=? and user_id=? AND sno=?', [req.query.request_id, req.query.user_id, req.query.sno], (err, row) => {
        conn.query('UPDATE buyer_request SET status=1 WHERE sno=?', [req.query.request_id], (err, row1) => {

            if (!err) {
                res.send({
                    status: 200,
                    message: 'Offer Accepted'
                })

            }
            else {
                res.send({
                    status: 400,
                    message: 'failed'
                })

            }
        })
    })

})

//end



//users favourites gigs

router.post('/gig_fav?', (req, res) => {


    conn.query('insert into favourites(user_id,gig_id) values(?,?)', [req.query.user_id, req.query.gig_id], (err, row) => {

        if (!err) {

            res.send({
                status: 200,
                message: 'gig added to favourite successfully'
            })
        }
        else {

            res.send({

                status: 400,
                message: 'failed'
            })
        }
    })


})

//end

//users remove favourites gigs

router.delete('/remove_gig_fav?', (req, res) => {

    conn.query('delete from favourites where user_id=? and gig_id=?', [req.query.user_id, req.query.gig_id], (err, row) => {

        if (!err) {

            res.send({
                status: 200,
                message: 'gig remove from favourite successfully'
            })
        }
        else {

            res.send({

                status: 400,
                message: 'failed'
            })
        }
    })


})

//end

//filter buyers request on seller gigs

router.get('/request_on_gigs?', (req, res) => {

    conn.query('select members.username,members.fullname,members.profilepicture,buyer_request.description,buyer_request.category_id,buyer_request.quantity,buyer_request.size,buyer_request.location,buyer_request.shipment,buyer_request.delivery_time,buyer_request.requested_image,colors.name from seller_offer LEFT JOIN buyer_request on seller_offer.request_id=buyer_request.sno LEFT join colors on buyer_request.color_id = colors.id left JOIN members on buyer_request.USERID = members.USERID where seller_offer.user_id=? and seller_offer.gig_id=? and buyer_request.status=0', [req.query.user_id, req.query.gig_id], (err, row) => {


        if (row.length > 0) {
            res.send({
                status: 200,
                requests: row
            })
        }
        else {
            res.send({
                status: 400,
                requests: []
            })
        }
    })
})


//end


//filter all gigs on buyer selecting category

router.get('/gig_on_category?', (req, res) => {

    conn.query('select sell_gigs.id,sell_gigs.user_id,sell_gigs.title,sell_gigs.gig_price,sell_gigs.total_views,sell_gigs.currency_type,sell_gigs.cost_type,sell_gigs.delivering_time,sell_gigs.gig_tags,sell_gigs.category_id,sell_gigs.gig_details,sell_gigs.super_fast_charges,sell_gigs.super_fast_delivery_desc,sell_gigs.super_fast_delivery_date,sell_gigs.requirements,sell_gigs.youtube_url,sell_gigs.vimeo_url,sell_gigs.created_date,gigs_image.image_path,feedback.rating from sell_gigs LEFT join gigs_image on sell_gigs.id = gigs_image.gig_id LEFT JOIN feedback on sell_gigs.id = feedback.gig_id where sell_gigs.category_id=?', [req.query.category_id], (err, row) => {

        if (row.length > 0) {
            res.send({
                status: 200,
                gigs: row
            })
        }
        else {
            res.send({
                status: 400,
                gigs: []
            })
        }
    })

})

//end

//single gig detail

router.get('/single_gig_detail?', (req, res) => {


    conn.query('select sell_gigs.id,sell_gigs.user_id,sell_gigs.title,sell_gigs.gig_price,sell_gigs.total_views,sell_gigs.currency_type,sell_gigs.cost_type,sell_gigs.delivering_time,sell_gigs.gig_tags,sell_gigs.category_id,sell_gigs.gig_details,sell_gigs.super_fast_charges,sell_gigs.super_fast_delivery_desc,sell_gigs.super_fast_delivery_date,sell_gigs.requirements,sell_gigs.youtube_url,sell_gigs.vimeo_url,sell_gigs.created_date,members.fullname,members.username,members.profileviews,members.profilepicture,gigs_image.image_path,feedback.rating from sell_gigs LEFT join gigs_image on sell_gigs.id = gigs_image.gig_id LEFT JOIN feedback on sell_gigs.id = feedback.gig_id LEFT JOIN members on sell_gigs.user_id= members.USERID  where sell_gigs.id=?', [req.query.gig_id], (err, row) => {


        if (row.length > 0) {
            res.send({
                status: 200,
                gig_detail: row[0]
            })
        }
        else {
            res.send({
                status: 400,
                gig_detail: []
            })
        }
    })
})


//end


//all my request for buyer


router.get('/myrequest?', (req, res) => {

    conn.query('SELECT sno,description,date from buyer_request where USERID=?', [req.query.buyer_id], (err, row) => {

        if (row.length > 0) {

            res.send({
                status: 200,
                request: row
            })
        }
        else {
            res.send({
                status: 400,
                request: []
            })
        }

    })


})

//end


module.exports = router;