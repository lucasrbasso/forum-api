import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateQuestionDTO {
  @ApiProperty()
  title: string

  @ApiProperty()
  content: string

  @ApiPropertyOptional()
  attachments: string[]
}
