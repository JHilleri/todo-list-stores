import { UnaryFunction } from 'rxjs';

export type ActionTypePrefix<Prefix, Type> = Prefix extends string
    ? Type extends string
        ? `[${Prefix}] ${Type}`
        : never
    : never;

export interface SourceGroup<Name extends string = string> {
    name: Name;
}

export function createSourceGroup<Name extends string, A extends SourceGroup<Name>>(
    name: Name,
    f: UnaryFunction<SourceGroup<Name>, A>
): A;
export function createSourceGroup<Name extends string, A extends SourceGroup<Name>, B extends A>(
    name: Name,
    f1: UnaryFunction<SourceGroup<Name>, A>,
    f2: UnaryFunction<A, B>
): B;
export function createSourceGroup<Name extends string, A extends SourceGroup<Name>, B extends A, C extends B>(
    name: Name,
    f1: UnaryFunction<SourceGroup<Name>, A>,
    f2: UnaryFunction<A, B>,
    f3: UnaryFunction<B, C>
): C;
export function createSourceGroup<
    Name extends string,
    A extends SourceGroup<Name>,
    B extends A,
    C extends B,
    D extends C
>(
    name: Name,
    f1: UnaryFunction<SourceGroup<Name>, A>,
    f2: UnaryFunction<A, B>,
    f3: UnaryFunction<B, C>,
    f4: UnaryFunction<C, D>
): D;
export function createSourceGroup<Name extends string>(name: string, ...features: UnaryFunction<any, any>[]) {
    let result = { name } as SourceGroup<Name>;
    for (const feature of features) {
        result = feature(result);
    }
    return result;
}
