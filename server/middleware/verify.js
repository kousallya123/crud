const jwt = require('jsonwebtoken');



const verifyJWT = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }
  
      req.userId = decoded.userId;
      next();
    });
  };
  
  module.exports={verifyJWT}