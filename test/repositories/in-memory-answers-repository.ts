import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswerDetails } from '@/domain/forum/enterprise/entities/value-objects/answer-details'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { InMemoryAnswerCommentsRepository } from './in-memory-answer-comments-repository'
import { InMemoryAnswerAttachmentsRepository } from './in-memory-answer-attachment-repository'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []
  constructor(
    private answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private answerCommentsRepository: InMemoryAnswerCommentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async create(answer: Answer) {
    this.items.push(answer)

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id)

    if (!answer) {
      return null
    }

    return answer
  }

  async save(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items[itemIndex] = answer

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getNewItems(),
    )

    await this.answerAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answers
  }

  async findManyWithDetailsByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<AnswerDetails[]> {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    const answerWithDetails = answers.map((answer) => {
      const author = this.studentsRepository.items.find((student) => {
        return student.id.equals(answer.authorId)
      })

      if (!author) {
        throw new Error(
          `Author with ID "${answer.authorId.toString()}" does not exists`,
        )
      }

      const answerAttachments = this.answerAttachmentsRepository.items.filter(
        (answerAttachment) => {
          return answerAttachment.answerId.equals(answer.id)
        },
      )

      const attachments = answerAttachments.map((answerAttachment) => {
        const attachment = this.attachmentsRepository.items.find(
          (attachment) => {
            return attachment.id.equals(answerAttachment.attachmentId)
          },
        )

        if (!attachment) {
          throw new Error(
            `Attachment with ID "${answerAttachment.attachmentId.toString()}" does not exists`,
          )
        }

        return attachment
      })

      let comments = [] as CommentWithAuthor[]

      this.answerCommentsRepository
        .findManyByAnswerIdWithAuthor(answer.id.toString(), {
          page: 1,
        })
        .then((value) => (comments = value))

      return AnswerDetails.create({
        answerId: answer.id,
        questionId: answer.questionId,
        authorId: answer.authorId,
        author: author.name,
        content: answer.content,
        attachments,
        comments,
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt,
      })
    })

    return answerWithDetails
  }

  async delete(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items.splice(itemIndex, 1)
    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
  }
}
