import { Notification } from "../models";
import { AppError } from "../utils/AppError";

export class NotificationService {
  public async getUserNotifications(userId: string) {
    const notifications = await Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]]
    });
    return notifications;
  }

  public async markAsRead(id: string, userId: string) {
    const notification = await Notification.findByPk(id);
    if (!notification) throw new AppError("Notification not found", 404);

    if (notification.userId !== userId) {
      throw new AppError("Forbidden: Cannot access this notification", 403);
    }

    notification.read = true;
    await notification.save();
    return notification;
  }
}
