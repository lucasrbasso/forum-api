import { ApiProperty } from '@nestjs/swagger'

export class AuthenticateDTO {
  @ApiProperty()
  email: string

  @ApiProperty()
  password: string
}
