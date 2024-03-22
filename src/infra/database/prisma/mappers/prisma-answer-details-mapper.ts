import {
  Answer as PrismaAnswer,
  User as PrismaUser,
  Attachment as PrismaAttachment,
  Comment as PrismaComment,
} from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { PrismaAttachmentMapper } from './prisma-attachments-mapper'
import { AnswerDetails } from '@/domain/forum/enterprise/entities/value-objects/answer-details'
import { PrismaCommentWithAuthorMapper } from './prisma-comment-with-author-mapper'

type PrismaCommentWithAuthor = PrismaComment & {
  author: PrismaUser
}

type PrismaAnswerDetails = PrismaAnswer & {
  author: PrismaUser
  attachments: PrismaAttachment[]
  comments: PrismaCommentWithAuthor[]
}

export class PrismaAnswerDetailsMapper {
  static toDomain(raw: PrismaAnswerDetails): AnswerDetails {
    return AnswerDetails.create({
      answerId: new UniqueEntityId(raw.id),
      questionId: new UniqueEntityId(raw.questionId),
      authorId: new UniqueEntityId(raw.author.id),
      author: raw.author.name,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      comments: raw.comments.map(PrismaCommentWithAuthorMapper.toDomain),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
