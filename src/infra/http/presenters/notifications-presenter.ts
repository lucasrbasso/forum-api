import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class NotificationsPresenter {
  static toHTTP(notification: Notification) {
    return {
      id: notification.id.toString(),
      content: notification.content,
      title: notification.title,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
    }
  }
}
