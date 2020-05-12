const jwt = require ('jsonwebtoken'); 
const User = require('../models/user');
const dotenv = require('dotenv');

dotenv.config();

const auth = async(req, res, next) => {
    if (req.headers['x-access-token'] || req.headers.authorization) {
        
        const token = await req.headers["x-access-token"] || await req.headers.authorization.replace('Bearer ', '');
        
        try {
            const data = jwt.verify(token, process.env.JWT_KEY);
            const user = await User.findOne({ _id: data._id, 'token': token });
            
            if (!user) {
                throw new Error();
            }
            req.user = user;
            req.token = token;
            next();
        } catch (error) {
            res.status(401).send({ 
                error: 'Not authorized to access this resource' 
            });
        }
    } else {
        return res.status(403).json({
            status: 403,
            message: 'FORBIDDEN'
          });
    }

};
module.exports = auth;