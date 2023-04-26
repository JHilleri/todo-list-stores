import { When, Given, Then, Step } from '@badeball/cypress-cucumber-preprocessor';

Given('je suis sur la page {string}.', (url: string) => {
    cy.visit(url);
});

When('je crée une tâche {string} dans la catégorie {string}.', (title: string, category: string) => {
    cy.findByRole('button', { name: /create item/i }).click();
    cy.findByRole('textbox', { name: /title/i }).type(title);
    cy.findByRole('combobox', { name: /category/i }).select(category);
    cy.findByRole('button', { name: /add/i }).click();
});

When('je marque la tâche {string} comme complétée.', (title: string) => {
    cy.findAllByRole('article', { name: title })
        .findByRole('button', { name: /completed/i })
        .click();
});

When('je marque toutes les tâches comme incomplètes.', () => {
    cy.findByRole('button', { name: /uncomplete all/i }).click();
});

Then('je vois {string} dans la liste des tâches.', (title: string) => {
    cy.findAllByRole('article', { name: title }).should('be.visible');
});

Then('je vois {string} dans la liste des tâches avec la catégorie {string}.', (title: string, category: string) => {
    cy.findAllByRole('article', { name: title })
        .findAllByTestId('tag')
        .should((tags) => {
            expect(tags).to.contain.text(category);
        });
});

Then('je ne vois pas {string} dans la liste des taches.', (title: string) => {
    cy.findAllByRole('article', { name: title }).should('not.exist');
});

Then('je vois {string} dans la liste des tâches complétées.', function (title: string) {
    cy.findByRole('checkbox', { name: /show completed/i }).check();
    Step(this, `je vois "${title}" dans la liste des tâches.`);
});

Then('je ne vois pas {string} dans la liste des tâches complétées.', function (title: string) {
    cy.findByRole('checkbox', { name: /show completed/i }).check();
    Step(this, `je ne vois pas "${title}" dans la liste des taches.`);
});

Then('je vois {string} comme étant complétée.', (title: string) => {
    cy.findAllByRole('article', { name: title })
        .findAllByTestId('tag')
        .should((tags) => {
            expect(tags).to.contain.text('Completed');
        });
});

Then('je ne vois pas {string} comme étant complétée.', (title: string) => {
    cy.findAllByRole('article', { name: title })
        .findAllByTestId('tag')
        .should((tags) => {
            expect(tags).not.to.contain.text('Completed');
        });
});
