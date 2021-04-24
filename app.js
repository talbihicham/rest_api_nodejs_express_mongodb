const express = require('express');
const mongoose  = require('mongoose');
const app = express();

//connection to the local database
const url = 'mongodb://localhost/nodejsapi';
mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology: true})
const con = mongoose.connection

con.on('open', () => {
    console.log('connected to the database ...')
})

//for using JSON correctly
app.use(express.json())

//if we have: /aliens, then use aliens.js 
const productRouter = require('./routes/products')
app.use('/products', productRouter)

module.exports = app;