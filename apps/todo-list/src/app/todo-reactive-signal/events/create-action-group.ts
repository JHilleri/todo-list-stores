import { pipeFromArray } from '@rx-angular/state/selections';
import { UnaryFunction } from 'rxjs';

const actionGroupBase = {} as const;
type ActionGroupBase = typeof actionGroupBase;

export function createActionGroup<R extends ActionGroupBase>(project: UnaryFunction<ActionGroupBase, R>): R;
export function createActionGroup<A extends ActionGroupBase, R extends A>(
    project_A: UnaryFunction<ActionGroupBase, A>,
    project_R: UnaryFunction<A, R>
): R;
export function createActionGroup(...project: UnaryFunction<any, any>[]) {
    return pipeFromArray(project)(actionGroupBase);
}
