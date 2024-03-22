import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Attachment } from '../attachment'
import { CommentWithAuthor } from './comment-with-author'

export interface AnswerDetailsProps {
  answerId: UniqueEntityId
  questionId: UniqueEntityId
  authorId: UniqueEntityId
  author: string
  content: string
  attachments: Attachment[]
  comments: CommentWithAuthor[]
  createdAt: Date
  updatedAt?: Date | null
}

export class AnswerDetails extends ValueObject<AnswerDetailsProps> {
  get answerId() {
    return this.props.questionId
  }

  get questionId() {
    return this.props.questionId
  }

  get authorId() {
    return this.props.authorId
  }

  get author() {
    return this.props.author
  }

  get content() {
    return this.props.content
  }

  get attachments() {
    return this.props.attachments
  }

  get comments() {
    return this.props.comments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: AnswerDetailsProps) {
    return new AnswerDetails(props)
  }
}
