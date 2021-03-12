const express = require('express');
const bodyparser = require('body-parser');
const user = require('./api/user');
const gig = require('./api/gig');
const conn = require('./db');

const engines = require("consolidate");
const paypal = require("paypal-rest-sdk");

require('./db');

var app = express();
const http = require('http').createServer(app);

app.engine("ejs", engines.ejs);
app.set("views", "./views");
app.set("view engine", "ejs");
const io = require('socket.io')(http);




//================================================================================================
                                    //stripe integration
//================================================================================================


//get customer credit card token `
app.post('/pay?', async (req, res) => {

    const stripe = require('stripe')('sk_test_51IQm8LHPMTxyWoKb3L0QjZkI96vOgwMuIwIhbzg5QL3lqHQvo43KxQrGSyBSgxBWiMKmUSgPeTjDuiXfM19tNm9100XCSoZcU9');

    // const paymentIntent = await stripe.paymentIntents.create({
    //     id:req.query.token,
    //     amount:4000,
    //     currency: 'usd',
    //     payment_method_types: ['card'], 
    //     receipt_email: 'digitalinnovation@gmail.com',
        
    // });

    const token = await stripe.tokens.create({
        card: {
          number: req.query.card_number,    
          exp_month: req.query.exp_month,
          exp_year: req.query.exp_year,
          cvc: req.query.cvc,
        },
      })

    if (token) {
        console.log(token);
        res.send({

            status: 200,
            response: token,
            message: 'payment intent created success'

        })
    }
})
//end



app.post('/payments',  async (req, res) => {
    // console.log('payment request..', req.body)
    const stripe = require('stripe')('sk_test_51IQm8LHPMTxyWoKb3L0QjZkI96vOgwMuIwIhbzg5QL3lqHQvo43KxQrGSyBSgxBWiMKmUSgPeTjDuiXfM19tNm9100XCSoZcU9');

    // var token = req.query.token // Using Express
    //Charge the user's card:
   
        var charge = await stripe.charges.create({
            amount: req.query.amount*100,
            currency: "usd",
            description: "test charge",
            source: req.query.token,
        });
        if (charge) {
            console.log('success payment', charge);
            res.send({
                status: 200,
                response: charge,
                message: 'payment success'
                })
        }
   
    
});







//================================================================================================
                                    //paypal integration
//================================================================================================


paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id:
        "Af10aoRnyiWPYkhkfYrfaJVNPNLX32KkA97Mxu5Fcot7uNoctZKc0a5kWVFb6hnVaipWM0deoDK0wsr0",
    client_secret:
        "ECMq27m12LyQJSVK0WZ_uv3S7gF9hYjN1x0EycOy1ZgwHCPIrCcFaMLdJRZQrWv--RhcvpFedXPVqmxV"
});

app.get("/pay_pal", (req, res) => {
    res.render("index");
});

app.get("/paypal", (req, res) => {
    var create_payment_json = {
        intent: "sale",
        payer: {
            payment_method: "paypal"
        },
        redirect_urls: {
            return_url: "https://c7e2c130362d.ngrok.io/success",
            cancel_url: "https://c7e2c130362d.ngrok.io/cancel"
        },
        transactions: [
            {
                item_list: {
                    items: [
                        {
                            name: "item",
                            sku: "item",
                            price: "1",
                            currency: "USD",
                            quantity: 1
                        }
                    ]
                },
                amount: {
                    currency: "USD",
                    total: "1"
                },
                description: "This is the payment description."
            }
        ]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            res.redirect(payment.links[1].href);
        }
    });
});

app.get("/success", (req, res) => {
    // res.send("Success");
    var PayerID = req.query.PayerID;
    var paymentId = req.query.paymentId;
    var execute_payment_json = {
        payer_id: PayerID,
        transactions: [
            {
                amount: {
                    currency: "USD",
                    total: "1"
                }
            }
        ]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (
        error,
        payment
    ) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            res.render("success");
        }
    });
});

app.get("cancel", (req, res) => {
    res.render("cancel");
});


io.on('connection', function (socket) {
    console.log('A user connected');
    socket.on("chat message", msg => {

        // console.log(ab);
        console.log(msg);

        conn.query('insert into chats(chat_from,chat_to,content,status) values(?,?,?,?)', [msg.chat_from, msg.chat_to, msg.content, 0], (err, row) => {
            console.log(err);
            console.log('not');

            var a = msg.chat_from;
            var b = msg.chat_to;
            var ab = a + "" + b;
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

app.get('/emit?', (req, res) => {
    var msg = "hfwefwejwj";

    io.emit("chat message", msg);

})

//api call
app.use('/user', user);
app.use('/gig', gig);

http.listen(3000, () => {
});