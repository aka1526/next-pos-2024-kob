const express = require('express');
const app = express();
const bodyPaser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({ extended: true }))
app.use(cors());
app.use(fileUpload());
app.use('/uploads', express.static('uploads'));
dotenv.config();

const reportInvoice = require('./routes/reportInvoice');
const userRouter = require('./routes/userRouter');
const foodTypeRouter = require('./routes/foodTypeRouter');
const foodSizeRouter = require('./routes/foodSizeRouter');
const reportRouter = require('./routes/reportRouter');
const billSaleRouter = require('./routes/billSaleRouter');
const organizationRouter = require('./routes/organizationRouter');
const saleTempRouter = require('./routes/saleTempRouter');
const foodRouter = require('./routes/foodRouter');
const tasteRouter = require('./routes/tasteRouter');
 
app.use('/api/invoice', reportInvoice);
app.use('/api/user', userRouter);
app.use('/api/foodtype', foodTypeRouter);
app.use('/api/foodSize', foodSizeRouter);
app.use('/api/report', reportRouter);
app.use('/api/billSale', billSaleRouter);
app.use('/api/organization', organizationRouter);
app.use('/api/saleTemp', saleTempRouter);
app.use('/api/food', foodRouter);
app.use('/api/taste', tasteRouter);
 
app.listen(3001, () => {
    console.log('API Server Running on Port 3001');
});