/* tslint:disable */
/* eslint-disable */
/**
 * ft_transcendance API
 * ft_transcendance API
 *
 * The version of the OpenAPI document: 1.0.11
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface OauthAuthenticationRequest
 */
export interface OauthAuthenticationRequest {
    /**
     * Authorisation code provided by 42 oauth flow
     * @type {string}
     * @memberof OauthAuthenticationRequest
     */
    code: string;
}

/**
 * Check if a given object implements the OauthAuthenticationRequest interface.
 */
export function instanceOfOauthAuthenticationRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "code" in value;

    return isInstance;
}

export function OauthAuthenticationRequestFromJSON(json: any): OauthAuthenticationRequest {
    return OauthAuthenticationRequestFromJSONTyped(json, false);
}

export function OauthAuthenticationRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): OauthAuthenticationRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'code': json['code'],
    };
}

export function OauthAuthenticationRequestToJSON(value?: OauthAuthenticationRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'code': value.code,
    };
}

