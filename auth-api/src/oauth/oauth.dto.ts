import { IsNotEmpty } from 'class-validator';
import { ApiProperty, } from '@nestjs/swagger';

/*
    Parameters
*/
export class RefreshTokenInput {
    @ApiProperty({
        description: 'Refresh token payload',
        example: 'd7d198196wfcfe61cd131cb0fd6192365ae7248c2acc68c6323f83ca8917546a',
    })
    @IsNotEmpty()
    token: string;
}

export class AuthorizationCodeQuery {
    @IsNotEmpty()
    code: string;
}

/*
    Response body
*/
export class TokenPayload {
    @ApiProperty({
        description: 'Access token payload',
        example: '07af7983c67ebf4c30f4484e8231a09eb847f270690027f3c8d43f044e0cd21d',
    })
    access_token: string;

    @ApiProperty({ description: 'Access token type', example: 'bearer' })
    token_type: string;

    @ApiProperty({ description: 'Access token expiration time', example: 7200 })
    expires_in: number;

    @ApiProperty({
        description: 'Refresh token payload',
        example: 'd7d198196efcfe61cd131cb0fd6192365ae7248c2acc68c6323f83ca8917546a',
    })
    refresh_token: string;

    @ApiProperty({ description: 'Authorization scope', example: 'public' })
    scope: string;

    @ApiProperty({
        description: 'Access token creation time',
        example: '16665511',
    })
    created_at: string;
}

export class Error {
    constructor(message: string) {
        this.message = message;
    }

    @ApiProperty({
        description: 'Message explaining the error',
        example: 'Message explaining the error',
    })
    message: string;
}
