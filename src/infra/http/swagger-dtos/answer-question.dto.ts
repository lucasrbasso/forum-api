import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class AnswerQuestionDTO {
  @ApiProperty()
  content: string

  @ApiPropertyOptional()
  attachments?: string[] | null
}
