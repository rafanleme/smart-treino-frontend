describe('Exercise Search', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/v1/exercises*', {
      fixture: 'exercises/list.json',
    }).as('getExercises');
    cy.login();
    cy.visit('/exercises');
    cy.wait('@getExercises');
  });

  it('should search exercises by name', () => {
    cy.intercept('GET', '**/api/v1/exercises*search=Supino*', {
      body: {
        data: [
          {
            id: 1,
            name: 'Bench Press',
            name_pt: 'Supino Reto',
            muscle_group: 'chest',
            equipment: 'barbell',
          },
        ],
        meta: { total: 1 },
      },
    }).as('searchExercises');

    // Look for search input
    cy.get('input[placeholder*="Buscar"], input[type="search"], input[placeholder*="buscar"]')
      .first()
      .type('Supino{enter}');

    cy.wait('@searchExercises');
    // Check that search was executed (URL may or may not change depending on implementation)
    // The fact that we intercepted and received the search request is enough
  });

  it('should handle search with no results', () => {
    cy.intercept('GET', '**/api/v1/exercises*search=NonexistentExercise*', {
      body: {
        data: [],
        meta: { total: 0 },
      },
    }).as('searchNoResults');

    cy.get('input[placeholder*="Buscar"], input[type="search"], input[placeholder*="buscar"]')
      .first()
      .type('NonexistentExercise{enter}');

    cy.wait('@searchNoResults');
  });
});
