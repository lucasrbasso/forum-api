import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { EditQuestionDTO } from '../swagger-dtos/edit-question.dto'

const EditQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()).default([]),
})
const bodyValidationPipe = new ZodValidationPipe(EditQuestionBodySchema)
type EditQuestionBodySchema = z.infer<typeof EditQuestionBodySchema>

const idParamSchema = z.string()
const paramValidationPipe = new ZodValidationPipe(idParamSchema)

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private EditQuestion: EditQuestionUseCase) {}

  @ApiOperation({
    summary: 'Edit a question',
    description: 'Edit a question',
    tags: ['Questions'],
  })
  @ApiBody({
    type: EditQuestionDTO,
    description: 'Required values for edit a question',
  })
  @ApiResponse({
    status: 204,
    description: 'Successful.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found.',
  })
  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id', paramValidationPipe) questionId: string,
  ) {
    const { title, content, attachments } = body
    const userId = user.sub

    const result = await this.EditQuestion.execute({
      questionId,
      attachmentsIds: attachments,
      title,
      content,
      authorId: userId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message)
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
