import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class BearerTokenDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^Bearer\s[\w-]*\.[\w-]*\.[\w-]*$/, {
    message: 'Invalid bearer token format',
  })
  authorization: string;
}
