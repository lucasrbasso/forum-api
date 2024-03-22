import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachment-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'
import { makeAttachment } from 'test/factories/make-attachment'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachments'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository

let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()

    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryAnswerCommentsRepository,
      inMemoryStudentsRepository,
    )
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch question answers', async () => {
    const author = makeStudent({
      name: 'John Doe',
    })

    inMemoryStudentsRepository.create(author)

    const firstAnswer = makeAnswer({
      authorId: author.id,
      questionId: new UniqueEntityId('question-1'),
    })

    const secondAnswer = makeAnswer({
      authorId: author.id,
      questionId: new UniqueEntityId('question-1'),
    })

    const firstAttachment = makeAttachment({
      title: 'Example first attachment',
    })

    const secondAttachment = makeAttachment({
      title: 'Example second attachment',
    })

    inMemoryAttachmentsRepository.create(firstAttachment)
    inMemoryAttachmentsRepository.create(secondAttachment)

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        attachmentId: firstAttachment.id,
        answerId: firstAnswer.id,
      }),
      makeAnswerAttachment({
        attachmentId: secondAttachment.id,
        answerId: secondAnswer.id,
      }),
    )

    inMemoryAnswersRepository.items.push(firstAnswer, secondAnswer)

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.value?.answers).toHaveLength(2)
    expect(result.value).toMatchObject({
      answers: expect.arrayContaining([
        expect.objectContaining({
          content: firstAnswer.content,
          author: author.name,
          attachments: [
            expect.objectContaining({
              title: 'Example first attachment',
            }),
          ],
        }),
        expect.objectContaining({
          content: secondAnswer.content,
          author: author.name,
          attachments: [
            expect.objectContaining({
              title: 'Example second attachment',
            }),
          ],
        }),
      ]),
    })
  })

  it('should be able to fetch paginated question answers', async () => {
    const author = makeStudent({
      name: 'John Doe',
    })

    inMemoryStudentsRepository.create(author)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityId('question-1'),
          authorId: author.id,
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.answers).toHaveLength(2)
  })
})
