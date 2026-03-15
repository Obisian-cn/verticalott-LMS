import { Request, Response, NextFunction } from "express";
import { NotificationService } from "../services/notification.service";
import { ok } from "../utils/response";
import { AuthRequest } from "../middlewares/auth";

export class NotificationController {
  private notificationService = new NotificationService();

  public getUserNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const notifications = await this.notificationService.getUserNotifications(req.user!.id);
      return ok(res, notifications, "Notifications retrieved successfully");
    } catch (err) {
      next(err);
    }
  };

  public markAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const notification = await this.notificationService.markAsRead(req.params.id, req.user!.id);
      return ok(res, notification, "Notification marked as read");
    } catch (err) {
      next(err);
    }
  };
}
