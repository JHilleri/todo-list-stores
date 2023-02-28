import { createAdapter, joinAdapters } from '@state-adapt/core';

export interface SettingsState {
    theme: 'light' | 'dark' | 'auto';
    primaryColorHue: number | undefined;
    secondaryColorHue: number | undefined;
    simulateServerDelay: number;
}

export const settingsInitialState: SettingsState = {
    theme: 'auto',
    primaryColorHue: 210,
    secondaryColorHue: 280,
    simulateServerDelay: 0,
};

export const settingsAdapter = joinAdapters<SettingsState>()({
    theme: createAdapter<SettingsState['theme']>()({}),
    primaryColorHue: createAdapter<SettingsState['primaryColorHue']>()({}),
    secondaryColorHue: createAdapter<SettingsState['secondaryColorHue']>()({}),
    simulateServerDelay: createAdapter<SettingsState['simulateServerDelay']>()({}),
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
})();
