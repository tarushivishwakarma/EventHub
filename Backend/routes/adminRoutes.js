const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuthMiddleware = require('../middleware/adminAuth');

router.get('/users', adminAuthMiddleware, adminController.getAllUsers);
router.get('/registrations', adminAuthMiddleware, adminController.getAllRegistrations);

router.post('/events', adminAuthMiddleware, adminController.createOfficialEvent);
router.get('/events', adminAuthMiddleware, adminController.getOfficialEvents);
router.put('/events/:id', adminAuthMiddleware, adminController.rescheduleOfficialEvent);
router.delete('/events/:id', adminAuthMiddleware, adminController.deleteOfficialEvent);

module.exports = router;
