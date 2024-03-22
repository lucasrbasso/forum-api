import { ApiProperty } from '@nestjs/swagger'

export class CommentOnAnswerDTO {
  @ApiProperty()
  content: string
}
