import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();
const notificationController = new NotificationController();

// GET /notifications
router.get("/", authenticate, notificationController.getUserNotifications);

// PATCH /notifications/:id/read
router.patch("/:id/read", authenticate, notificationController.markAsRead);

export default router;
