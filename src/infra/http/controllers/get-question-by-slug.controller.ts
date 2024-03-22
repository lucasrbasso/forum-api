import { Controller, Get, NotFoundException, Param } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { QuestionDetailsPresenter } from '../presenters/question-details-presenter'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

const slugParamSchema = z.string()

const paramValidationPipe = new ZodValidationPipe(slugParamSchema)

type SlugQueryParamSchema = z.infer<typeof slugParamSchema>

@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @ApiOperation({
    summary: 'Get question with details by slug',
    description: '',
    tags: ['Questions'],
  })
  @ApiResponse({
    status: 200,
    description: 'Question',
  })
  @ApiResponse({
    status: 404,
  })
  @Get()
  async handle(@Param('slug', paramValidationPipe) slug: SlugQueryParamSchema) {
    const result = await this.getQuestionBySlug.execute({
      slug,
    })

    if (result.isLeft()) {
      const error = result.value
      throw new NotFoundException(error.message)
    }

    return { question: QuestionDetailsPresenter.toHTTP(result.value.question) }
  }
}
