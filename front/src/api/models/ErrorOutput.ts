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
 * @interface ErrorOutput
 */
export interface ErrorOutput {
    /**
     * 
     * @type {string}
     * @memberof ErrorOutput
     */
    message: string;
}

/**
 * Check if a given object implements the ErrorOutput interface.
 */
export function instanceOfErrorOutput(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "message" in value;

    return isInstance;
}

export function ErrorOutputFromJSON(json: any): ErrorOutput {
    return ErrorOutputFromJSONTyped(json, false);
}

export function ErrorOutputFromJSONTyped(json: any, ignoreDiscriminator: boolean): ErrorOutput {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'message': json['message'],
    };
}

export function ErrorOutputToJSON(value?: ErrorOutput | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'message': value.message,
    };
}

