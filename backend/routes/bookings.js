const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const verifyToken = require("../middleware/verifyToken"); // زي ما عندك

// حجز فعالية
router.post("/:eventId", verifyToken, bookingController.createBooking);

// إلغاء الحجز
router.delete("/:bookingId", verifyToken, bookingController.cancelBooking);

// عرض حجوزات المستخدم
router.get("/my", verifyToken, bookingController.getMyBookings);

module.exports = router;
