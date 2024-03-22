import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class EditAnswerDTO {
  @ApiProperty()
  content: string

  @ApiPropertyOptional()
  attachments: string[]
}
