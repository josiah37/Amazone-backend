// we alrady made a back end with firebase function tool but that needs credintials though it is free
//  so we do it manually by listennig to a spesific port
const express = require("express");
const cors = require("cors");

// getting the stipe key
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();
// enabling cross origin
app.use(cors({ origin: true }));
// to handle incase we recive json data on the server
app.use(express.json());

//handling requests
app.get("/", (req, res) => {
   res.status(200).json({ message: "succsess!" });
});

// now in the place of handling that with firebase we listen to a specific port

// testing
// app.post("/payment/create", (req, res) => {
//    const total = req.query.total;
//    if (total > 0) {
//       res.status(200).json({ message: `Payment received, ${total}` });
//    } else {
//       res.status(400).json({ error: "Invalid payment amount" });
//    }
// });

app.post("/payment/create", async (req, res) => {
   const total = req.query.total;
   if (total > 0) {
      const paymentIntent = await stripe.paymentIntents.create({
         amount: total,
         currency: "USD",
      });

      res.status(201).json({
         clientSecret: paymentIntent.client_secret,
      });
   } else {
      res.status(403).json({
         message: "total must be greater than 0",
      });
   }
});

app.listen(5000, (err) => {
   if (err) {
      console.error("there is an error: ", err);
   } else {
      // start by defualt knows that we are setting trying to run the server... so we use npm start
      // if we want to use other we need to add run:  npm run <any alias>
      console.log("up and running!!\n  and you can find it here http://127.0.0.1:5000");
   }
});
