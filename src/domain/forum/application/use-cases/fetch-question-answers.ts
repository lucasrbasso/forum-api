import { AnswersRepository } from '../repositories/answers-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { AnswerDetails } from '../../enterprise/entities/value-objects/answer-details'

interface FetchQuestionAnswersUseCaseRequest {
  page: number
  questionId: string
}

type FetchQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answers: AnswerDetails[]
  }
>

@Injectable()
export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers =
      await this.answersRepository.findManyWithDetailsByQuestionId(questionId, {
        page,
      })

    return right({ answers })
  }
}
