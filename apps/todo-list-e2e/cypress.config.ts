import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import * as createBundler from '@bahmutov/cypress-esbuild-preprocessor';

export default defineConfig({
    e2e: {
        ...nxE2EPreset(__dirname),
        baseUrl: 'http://localhost:4200',
        specPattern: ['**/*.feature', '**/*.cy.ts'],
        async setupNodeEvents(
            on: Cypress.PluginEvents,
            config: Cypress.PluginConfigOptions
        ): Promise<Cypress.PluginConfigOptions> {
            // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
            await addCucumberPreprocessorPlugin(on, config);

            on(
                'file:preprocessor',
                createBundler({
                    plugins: [createEsbuildPlugin(config)],
                })
            );

            // Make sure to return the config object as it might have been modified by the plugin.
            return config;
        },
    },
    experimentalStudio: true,
});
