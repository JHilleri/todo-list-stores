import { TodoItem } from './todo-item';

export function filterTodoItems(
    items: TodoItem[],
    { showCompleted, filter }: { showCompleted?: boolean; filter?: string }
) {
    return items.filter((item) => {
        const matchCompleted = showCompleted || !item.completed;
        const matchFilter = filter
            ? item.title.includes(filter) || item.text.includes(filter) || item.tags.some((tag) => tag.includes(filter))
            : true;
        return matchCompleted && matchFilter;
    });
}
