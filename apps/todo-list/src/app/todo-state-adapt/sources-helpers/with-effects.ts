import { Observable } from 'rxjs';

export function withDerivedSources<Base, WithDerived extends Record<Exclude<string, keyof Base>, Observable<any>>>(
    project: (base: Base) => WithDerived
) {
    return (base: Base) => {
        const derived = project(base);
        return { ...base, ...derived } as Extract<WithDerived, Base> extends Base ? Base & WithDerived : never;
    };
}
