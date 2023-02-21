import { getMockedTodoItems } from './get-mocked-todo-items';

describe('dataAccessTodo', () => {
    it('should work', () => {
        expect(getMockedTodoItems()).toEqual([
            {
                id: 1,
                title: 'Todo 1',
                text: 'Todo 1 text',
                completed: false,
            },
            {
                id: 2,
                title: 'Todo 2',
                text: 'Todo 2 text',
                completed: false,
            },
        ]);
    });
});
