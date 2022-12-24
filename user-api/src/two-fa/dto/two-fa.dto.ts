import { IsBoolean, Length, IsJWT } from 'class-validator';

export class VerifyTwoFaCodeDto
{
	@IsJWT()
    token: string;

	@Length(6, 6)
	code: string
}

export class SendMailDto 
{
	@IsJWT()
    token: string;
}