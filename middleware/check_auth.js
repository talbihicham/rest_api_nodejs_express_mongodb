const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        //const token = req.header.Authorization.splite(" ")[1];
        const token = req.header('Authorization')
        //console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
}