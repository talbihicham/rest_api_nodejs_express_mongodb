const express = require('express');
const router = express.Router()

const Product = require('../models/product')

router.get('/', async (req, res) => {
    try{
        Product.find()
        .select('_id name price')
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
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
        .select('name price _id')
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

router.post('/', async (req, res) => {
    
    const product = new Product({
        name: req.body.name,
        price: req.body.price
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
        const p1 = await product.save()
        // res.json(p1)
        
            res.status(200).json({
                message: 'Product updated successfully',
                updatedProduct: {
                    name: p1.name,
                    price: p1.price,
                    _id: p1._id
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3030/products/'+ p1.id
                }
            });
        
        
    } catch(e) {
        res.send('Error ' + e)
    }
    
});

router.delete('/:id', async (req, res) => {
    try{
        const product = await Product.findById(req.params.id)
        // alien.sub = req.body.sub
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