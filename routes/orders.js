const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');




router.get('/', async (req, res) => {
    try{
        Order.find()
        .select('_id product quantity')
        .then(docs => {
            const response = {
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        productId: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3030/orders/'+ doc._id 
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



router.get('/:orderId', async (req, res) => {
    try{
        Order.findById(req.params.orderId)
        .select('product _id quantity') // we select fields that we want to show 
        .then(doc => {
            /*console.log("From database", doc);*/
            // res.status(200).json(doc);
            if(doc){
                res.status(200).json({
                    order: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3030/orders'
                    }
                });
            } else{
                res.status(404).json({message: 'No found order for this ID'})
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

    const order = new Order({
        quantity: req.body.quantity,
        product: req.body.productId
    })

    try{
        order.save()
        .then(result => {
            /*console.log(result);*/
            res.status(201).json({
                message: 'Order created successfully',
                createdOrder: {
                    id: result._id,
                    quantity: result.quantity,
                    product: result.product,
                    result: {
                        type: 'GET',
                        url: 'http://localhost:3030/orders/'+ result._id
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
})


router.patch('/:id', async (req, res) => {

    try{
        const order = await Order.findById(req.params.id)
        if(req.body.product) { order.product = req.body.product }
        if(req.body.quantity) { order.quantity = req.body.quantity }

        const ord1 = await order.save()
        
        res.status(200).json({
            message: 'Order updated successfully',
            updatedOrder: {
                _id: ord1._id,
                product: ord1.product,
                quantity: ord1.quantity
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3030/orders/'+ ord1._id
            }
        });
        
        
    } catch(e) {
        res.send('Error ' + e)
    }
    
});


router.delete('/:id', async (req, res) => {
    try{
        const order = await Order.findById(req.params.id)
        const ord1 = await order.remove()
        // res.json(ord1)
        .then(result => {
            res.status(200).json({
                message: 'Order deleted successfully',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3030/orders',
                    body: {
                        product: 'String', 
                        quantity: 'Number'
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