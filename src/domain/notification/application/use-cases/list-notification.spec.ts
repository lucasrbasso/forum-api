import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { makeNotification } from 'test/factories/make-notification'
import { ListNotificationsUseCase } from './list-notification'
import { makeStudent } from 'test/factories/make-student'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ListNotificationsUseCase

describe('List Notifications', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ListNotificationsUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to list notifications', async () => {
    const notification = makeNotification()

    inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.notifications).toHaveLength(1)
    expect(result.value?.notifications).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          recipientId: notification.recipientId,
        }),
      ]),
    )
  })

  it('should be able to fetch paginated notifications by recipient id', async () => {
    const recipient = makeStudent()

    for (let i = 1; i <= 22; i++) {
      await inMemoryNotificationsRepository.create(
        makeNotification({
          recipientId: recipient.id,
        }),
      )
    }

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      page: 2,
    })

    expect(result.value?.notifications).toHaveLength(2)
  })
})
