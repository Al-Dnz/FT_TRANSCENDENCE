import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { OauthService } from "./oauth.service";
import { Observable } from "rxjs";
import {
    RefreshTokenInput,
    AuthorizationCodeQuery,
    TokenPayload,
    Error,
} from "./oauth.dto";
import {
    ApiBadRequestResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";

@ApiTags("oauth")
@Controller("api/oauth")
export class OauthController {
    constructor(private readonly api42: OauthService) { }

    @ApiOkResponse({
        description: "successfull authentication",
        type: TokenPayload,
    })
    @ApiBadRequestResponse({ description: "no code provided", type: Error })
    @ApiUnauthorizedResponse({
        description: "invalid code provided",
        type: Error,
    })
    @ApiInternalServerErrorResponse({
        description: "internal server error",
        type: Error,
    })
    @ApiQuery({
        name: "code",
        type: "string",
        description: "oauth authorization code",
    })
    @Get("callback")
    oauthCallback(
        @Query() query: AuthorizationCodeQuery
    ): Observable<TokenPayload> {
        return this.api42.validAuthCode(query.code);
    }

    @ApiOkResponse({
        description: "successfull refresh",
        type: TokenPayload,
    })
    @ApiBadRequestResponse({
        description: "no refresh token provided",
        type: Error,
    })
    @ApiUnauthorizedResponse({
        description: "invalid refresh token provided",
        type: Error,
    })
    @ApiInternalServerErrorResponse({
        description: "internal server error",
        type: Error,
    })
    @Post("token")
    refreshToken(@Body() body: RefreshTokenInput): Observable<TokenPayload> {
        return this.api42.refreshToken(body.token);
    }
}
