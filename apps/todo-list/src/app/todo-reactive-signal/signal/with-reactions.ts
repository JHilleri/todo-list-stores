import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, merge } from 'rxjs';

type Reaction<Args extends [] | [any] = []> = Args extends [infer Arg]
    ? (value: Observable<Arg> | Observable<Arg>[]) => void
    : (value: Observable<unknown> | Observable<unknown>[]) => void;

export function createUpdater<V>(project: (value: V) => void): Reaction<[V]>;
export function createUpdater(project: () => void): Reaction;
export function createUpdater<V = void>(project: (value: V) => void | (() => void)) {
    return (value: Observable<V> | Observable<V>[]) => {
        if (Array.isArray(value)) {
            merge(...value)
                .pipe(takeUntilDestroyed())
                .subscribe(project);
            return;
        }
        value.pipe(takeUntilDestroyed()).subscribe(project);
    };
}

export function withUpdaters<Base, Reactions extends Record<string, (value: any) => void>>(
    reactionsProject: (value: Base) => Reactions
) {
    return (base: Base) => {
        const reactions: Record<string, any> = {};
        for (const [key, value] of Object.entries(reactionsProject(base))) {
            reactions[key] = createUpdater(value);
        }
        return Object.assign(base as any, {
            updater: {
                ...(base as { updater?: Record<string, any> }).updater,
                ...reactions,
            },
        }) as Base & {
            updater: {
                [Key in keyof Reactions]: Parameters<Reactions[Key]> extends [infer Args] ? Reaction<[Args]> : Reaction;
            };
        };
    };
}
