import { Source } from '@state-adapt/rxjs';
import { SourceGroup } from './create-source-group';

export function sourceBuilder<T>() {
    return (prefix: string, name: string) => new Source<T>(`[${prefix}] ${name}`);
}

export function withSources<T extends Record<string, (prefix: string, name: string) => Source<any>>>(
    sourcesDictionary: T
) {
    type Keys = keyof T;
    return <BaseName extends string, Base extends SourceGroup<BaseName>>(base: Base) => {
        const sources = Object.entries(sourcesDictionary).reduce((acc, [key, value]) => {
            acc[key as Keys] = value(base.name, key);
            return acc;
        }, {} as { [K in Keys]: Source<any> }) as { [K in Keys]: ReturnType<T[K]> };
        return {
            ...base,
            ...sources,
        };
    };
}
