import { Source, getRequestSources } from '@state-adapt/rxjs';
import { Observable } from 'rxjs';
import { SourceGroup, ActionTypePrefix } from './create-source-group';
import { Action } from '@state-adapt/core';
import { RequestProject, createRequestActions } from './create-request-actions';

export interface requestActions<Prefix extends string, Result> {
    success$: Observable<Action<Result, `${Prefix}.success$`>>;
    error$: Observable<Action<unknown, `${Prefix}.error$`>>;
}

export interface RequestActionsWithSource<Prefix extends string, Result, Args extends [] | [unknown]>
    extends requestActions<Prefix, Result> {
    source$: Source<Args extends [infer Arg] ? Arg : void>;
    next: Args extends [infer Arg] ? (args: Arg) => void : () => void;
}

export function withImediatRequests<T extends Record<string, Observable<any>>>(dictionary: T) {
    return <BaseName extends string, Base extends SourceGroup<BaseName>>(base: Base) => {
        const requestActions: Record<string, unknown> = {};
        for (const [key, request] of Object.entries(dictionary)) {
            requestActions[key] = getRequestSources(`[${base.name}] ${key}`, request);
        }
        return {
            ...base,
            ...(requestActions as {
                [K in keyof T]: T[K] extends Observable<infer Result>
                    ? requestActions<ActionTypePrefix<BaseName, K>, Result>
                    : never;
            }),
        };
    };
}

export function withRequests<T extends Record<string, RequestProject<any, any>>>(dictionary: T) {
    return <BaseName extends string, Base extends SourceGroup<BaseName>>(base: Base) => {
        const requestActions: Record<string, unknown> = {};
        for (const [key, request] of Object.entries(dictionary)) {
            requestActions[key] = createRequestActions(`[${base.name}] ${key}`, request);
        }
        return {
            ...base,
            ...(requestActions as {
                [K in keyof T]: T[K] extends RequestProject<infer Result, any>
                    ? RequestActionsWithSource<ActionTypePrefix<BaseName, K>, Result, Parameters<T[K]>>
                    : never;
            }),
        };
    };
}
