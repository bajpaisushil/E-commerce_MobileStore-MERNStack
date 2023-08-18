const express=require('express');
const cors=require('cors');
const products = require('./products');
const mongoose=require('mongoose');
const register=require('./routes/register');
const login=require('./routes/login');
const stripe=require('./routes/stripe');
const productsRoute=require('./routes/products');
const users=require('./routes/users');
const orders=require('./routes/orders');
const bodyParser=require('body-parser');

require('dotenv').config();
const app=express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use('/api/register', register);
app.use('/api/login', login);
app.use('/api/stripe', stripe);
app.use('/api/orders', orders);
app.use('/api/users', users);
app.use('/api/products', productsRoute);

app.get('/ping', (req, res)=>{
    res.send('Pong');
})

app.get('/products', (req, res)=>{
    res.send(products);
})
const PORT=process.env.PORT || 5000;
const DB_URL=process.env.MONGO_URL;
app.listen(5000, ()=>{
    console.log(`Server is running on Port ${PORT}`);
})

mongoose.connect(DB_URL)
.then(()=> console.log('Connected to MongoDB'))
.catch((err)=> console.log('DB Connection failed ', err.message))

