import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class EditQuestionDTO {
  @ApiProperty()
  title: string

  @ApiProperty()
  content: string

  @ApiPropertyOptional()
  attachments: string[]
}
