function createItem(title: string, category: string) {
    cy.findByRole('button', { name: /create item/i }).click();
    cy.findByRole('textbox', { name: /title/i }).type(title);
    cy.findByRole('combobox', { name: /category/i }).select(category);
    cy.findByRole('button', { name: /add/i }).click();
}

describe('scenario simple', () => {
    const pathsToTest = ['imperative', 'rxjs', 'ngrx', 'ngrx-component-store', 'state-adapt', 'rx-angular', 'signal'];
    for (const path of pathsToTest) {
        it(`pass with ${path}`, () => {
            cy.visit(path);

            createItem('item-1', 'category 1');
            cy.findAllByTestId('todo-card')
                .should('have.length', 1)
                .its(0)
                .findByRole('button', { name: /completed/i })
                .click();
            cy.findAllByTestId('todo-card').should('have.length', 0);
            cy.findByRole('checkbox', { name: /show completed/i }).click();
            cy.findAllByTestId('todo-card').should('have.length', 1).its(0).findAllByTestId('tag').as('tags');
            cy.get('@tags').contains(/completed/i);
            cy.get('@tags').contains(/category 1/i);
            createItem('item-2', 'category 2');
            cy.findAllByTestId('todo-card').should('have.length', 2);
            cy.findByRole('checkbox', { name: /show completed/i }).click();
            cy.findAllByTestId('todo-card').should('have.length', 1);
            cy.findByRole('button', { name: 'Complete All', exact: false }).click();
            cy.findAllByTestId('todo-card').should('have.length', 0);
            cy.findByRole('button', { name: /uncomplete all/i }).click();
            cy.findAllByTestId('todo-card').should('have.length', 2);
        });
    }
});
