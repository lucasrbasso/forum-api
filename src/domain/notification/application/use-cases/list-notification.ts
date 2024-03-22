import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { Notification } from '../../enterprise/entities/notification'

interface ListNotificationsUseCaseRequest {
  recipientId: string
  page: number
}

type ListNotificationsUseCaseResponse = Either<
  null,
  {
    notifications: Notification[]
  }
>
@Injectable()
export class ListNotificationsUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    page,
  }: ListNotificationsUseCaseRequest): Promise<ListNotificationsUseCaseResponse> {
    const notifications =
      await this.notificationsRepository.findManyByRecipientId(recipientId, {
        page,
      })

    return right({
      notifications,
    })
  }
}
