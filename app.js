const express = require('express');
const mongoose  = require('mongoose');
const app = express();



//mongoose.connect('mongodb+srv://hicham1999:' + process.env.MONGO_ATLAS_PASSWORD + '@node-rest-shop.d463t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})




//connection to the local database
const url = 'mongodb://localhost/nodejsapi';
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})

//mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology: true})
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