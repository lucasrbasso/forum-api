import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '../../enterprise/entities/question'
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details'
import { QuestionWithAuthor } from '../../enterprise/entities/value-objects/question-with-author'

export abstract class QuestionsRepository {
  abstract findById(id: string): Promise<Question | null>
  abstract create(question: Question): Promise<void>
  abstract findBySlug(slug: string): Promise<Question | null>
  abstract findDetailsBySlug(slug: string): Promise<QuestionDetails | null>
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>
  abstract findManyWithAuthorRecent(
    params: PaginationParams,
  ): Promise<QuestionWithAuthor[]>

  abstract delete(question: Question): Promise<void>
  abstract save(question: Question): Promise<void>
}
