const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const verifyToken = require('../middleware/verifyToken');

// إنشاء فعالية جديدة (يتطلب Organizer)
router.post('/', verifyToken, eventsController.createEvent);

// عرض جميع الفعاليات (مفتوح للجميع)
router.get('/', eventsController.getAllEvents);

router.get('/myevents', verifyToken, eventsController.getMyEvents);
// عرض فعالية محددة بواسطة ID (مفتوح للجميع)
router.get('/:id', eventsController.getEventById);

// تحديث فعالية (يتطلب Organizer)
router.put('/:id', verifyToken, eventsController.updateEvent);

// حذف فعالية (يتطلب Organizer)
router.delete('/:id', verifyToken, eventsController.deleteEvent);



module.exports = router;
