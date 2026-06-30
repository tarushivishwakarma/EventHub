const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';
const Admin = require('../models/Admin');

const adminAuthMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    if (decoded.role !== 'admin') {
       return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
        return res.status(401).json({ error: 'Invalid token.' });
    }

    req.admin = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = adminAuthMiddleware;
