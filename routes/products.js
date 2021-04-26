const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const Product = require('../models/product')


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        // const date = new Date();
        // cb(null, date.toISOString() + file.originalname);
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter= (req, file, cb) => {
    //reject the file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, false);
    }
    
};

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 100
    },
    fileFilter: fileFilter
});




router.get('/', async (req, res) => {
    try{
        Product.find()
        .select('_id name price productImage')
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3030/products/'+ doc._id 
                        }
                    }
                })
            }
            // if(docs.length >= 0){
                res.status(200).json(response);
            // } else {
            //     res.status(404).json({
            //         message: 'no data found'
            //     })
            // }
            
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
        
    } catch(e) {
        res.send('Error' + e)
    }
    
});

router.get('/:productId', async (req, res) => {
    try{
        Product.findById(req.params.productId)
        .select('name price _id productImage')
        .then(doc => {
            /*console.log("From database", doc);*/
            // res.status(200).json(doc);
            if(doc){
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3030/products'
                    }
                });
            } else{
                res.status(404).json({message: 'No found product for this ID'})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
        // res.json(product)
    } catch(e) {
        res.send('Error' + e)
    }
    
});

router.post('/', upload.single('productImage'), async (req, res) => {
    
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    
    try{
        product.save()
        .then(result => {
            /*console.log(result);*/
            res.status(201).json({
                message: 'Product created successfully',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    productImage: result.productImage,
                    _id: result._id,
                    result: {
                        type: 'GET',
                        url: 'http://localhost:3030/products/'+ result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
        // res.json(p1)
    } catch(e) {
        res.send('Error' + e)
    }
    
});

router.patch('/:id', async (req, res) => {
    try{
        const product = await Product.findById(req.params.id)
        if(req.body.price) { product.price = req.body.price }
        if(req.body.name) { product.name = req.body.name }
        if(req.body.productImage) { product.productImage = req.file.path }
        // product.productImage = req.file.path
        const p1 = await product.save()
        // res.json(p1)
        
        res.status(200).json({
            message: 'Product updated successfully',
            updatedProduct: {
                name: p1.name,
                price: p1.price,
                productImage: p1.productImage,
                _id: p1._id
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3030/products/'+ p1._id
            }
        });
        
        
    } catch(e) {
        res.send('Error ' + e)
    }
    
});

router.delete('/:id', async (req, res) => {
    try{
        const product = await Product.findById(req.params.id)
        const p1 = await product.remove()
        // res.json(p1)
        .then(result => {
            res.status(200).json({
                message: 'Product deleted successfully',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3030/products',
                    body: {
                        name: 'String', 
                        price: 'Number'
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
    } catch(e) {
        res.send('Error ' + e)
    }
    
});


module.exports = router