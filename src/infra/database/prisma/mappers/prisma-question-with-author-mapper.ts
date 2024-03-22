import { Question as PrismaQuestion, User as PrismaUser } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { QuestionWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/question-with-author'

type PrismaQuestionWithAuthor = PrismaQuestion & {
  author: PrismaUser
}

export class PrismaQuestionWithAuthorMapper {
  static toDomain(raw: PrismaQuestionWithAuthor): QuestionWithAuthor {
    return QuestionWithAuthor.create({
      questionId: new UniqueEntityId(raw.id),
      authorId: new UniqueEntityId(raw.author.id),
      author: raw.author.name,
      title: raw.title,
      slug: Slug.create(raw.slug),
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityId(raw.bestAnswerId)
        : null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
