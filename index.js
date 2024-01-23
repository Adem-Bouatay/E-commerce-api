const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const orderRoute = require('./routes/order');
const cartRoute = require('./routes/cart');
const stripeRoute = require('./routes/stripe');

dotenv.config();

mongoose.connect(process.env.MongoLink)
  .then(()=>{
    console.log('DB Connected Successfully!')
}).catch((err)=>{
    console.log(err)
});

app.use(cors())
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);


app.listen(process.env.PORT || 5000,()=>{
    console.log("Server is running!");
});