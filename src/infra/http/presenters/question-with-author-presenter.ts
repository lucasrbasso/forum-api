import { QuestionWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/question-with-author'

export class QuestionWithAuthorPresenter {
  static toHTTP(question: QuestionWithAuthor) {
    console.log(question)
    console.log(question.questionId)

    return {
      id: question.questionId.toString(),
      authorId: question.authorId.toString(),
      author: question.author,
      title: question.title,
      slug: question.slug.value,
      bestAnswerId: question.bestAnswerId?.toString(),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
