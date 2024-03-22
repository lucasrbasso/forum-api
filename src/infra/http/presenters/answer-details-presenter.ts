import { AnswerDetails } from '@/domain/forum/enterprise/entities/value-objects/answer-details'
import { AttachmentPresenter } from './attachment-presenter'
import { CommentWithAuthorPresenter } from './comment-with-author-presenter'

export class AnswerDetailsPresenter {
  static toHTTP(answer: AnswerDetails) {
    return {
      id: answer.answerId.toString(),
      content: answer.content,
      authorId: answer.authorId.toString(),
      author: answer.author,
      attachments: answer.attachments.map(AttachmentPresenter.toHTTP),
      comments: answer.comments.map(CommentWithAuthorPresenter.toHTTP),
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
