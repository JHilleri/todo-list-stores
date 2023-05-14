import { createAdapter, joinAdapters } from '@state-adapt/core';
import { Theme } from '../../../utils/src/lib/theme';

export interface SettingsState {
    theme: Theme;
    primaryColorHue: number | undefined;
    secondaryColorHue: number | undefined;
    simulateServerDelay: number;
    simulateServerErrors: {
        loadCategories: boolean;
        loadTodos: boolean;
        addTodo: boolean;
        updateTodo: boolean;
        completeTodo: boolean;
        completeAllTodos: boolean;
        uncompleteAllTodos: boolean;
        deleteTodo: boolean;
    };
}

export const settingsInitialState: SettingsState = {
    theme: 'auto',
    primaryColorHue: 210,
    secondaryColorHue: 280,
    simulateServerDelay: 0,
    simulateServerErrors: {
        loadCategories: false,
        loadTodos: false,
        addTodo: false,
        updateTodo: false,
        completeTodo: false,
        completeAllTodos: false,
        uncompleteAllTodos: false,
        deleteTodo: false,
    },
};

export const settingsAdapter = joinAdapters<SettingsState>()({
    theme: createAdapter<SettingsState['theme']>()({}),
    primaryColorHue: createAdapter<SettingsState['primaryColorHue']>()({}),
    secondaryColorHue: createAdapter<SettingsState['secondaryColorHue']>()({}),
    simulateServerDelay: createAdapter<SettingsState['simulateServerDelay']>()({}),
    simulateServerErrors: joinAdapters<SettingsState['simulateServerErrors']>()({
        loadCategories: createAdapter<boolean>()({}),
        loadTodos: createAdapter<boolean>()({}),
        addTodo: createAdapter<boolean>()({}),
        updateTodo: createAdapter<boolean>()({}),
        completeTodo: createAdapter<boolean>()({}),
        completeAllTodos: createAdapter<boolean>()({}),
        uncompleteAllTodos: createAdapter<boolean>()({}),
        deleteTodo: createAdapter<boolean>()({}),
    })(),
})({
    styleSeetContent: (state) => {
        if (state.primaryColorHue === undefined) {
            return '';
        } else {
            return `:root {
                --primary-hue: ${state.primaryColorHue};
                --secondary-hue: ${state.secondaryColorHue};
            }`;
        }
    },
})({
    vm: (state) => ({
        theme: state.theme,
        primaryColorHue: state.primaryColorHue,
        secondaryColorHue: state.secondaryColorHue,
        simulateServerDelay: state.simulateServerDelay,
        simulateServerErrors: state.simulateServerErrors,
        styleSeetContent: state.styleSeetContent,
    }),
})();
