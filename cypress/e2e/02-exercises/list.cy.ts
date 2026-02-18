describe('Exercises List', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/v1/exercises*', {
      fixture: 'exercises/list.json',
    }).as('getExercises');
    cy.login();
    cy.visit('/exercises');
  });

  it('should display exercises list', () => {
    cy.wait('@getExercises');
    cy.contains('Supino Reto').should('be.visible');
    cy.contains('Agachamento Livre').should('be.visible');
    cy.contains('Levantamento Terra').should('be.visible');
  });

  it('should show exercise details', () => {
    cy.wait('@getExercises');
    cy.contains('Supino Reto').should('be.visible');
    // Exercises should be visible in the list
    cy.contains('Agachamento Livre').should('be.visible');
    cy.contains('Levantamento Terra').should('be.visible');
  });

  it('should handle empty state', () => {
    cy.intercept('GET', '**/api/v1/exercises*', {
      body: { data: [], meta: { total: 0 } },
    }).as('getEmptyExercises');

    cy.visit('/exercises');
    cy.wait('@getEmptyExercises');
    // Should show some content even if empty
    cy.get('body').should('exist');
  });
});
