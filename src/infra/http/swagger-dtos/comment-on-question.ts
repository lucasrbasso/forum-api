import { ApiProperty } from '@nestjs/swagger'

export class CommentOnQuestionDTO {
  @ApiProperty()
  content: string
}
