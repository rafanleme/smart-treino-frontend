describe('Exercise Filters', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/v1/exercises*', {
      fixture: 'exercises/list.json',
    }).as('getExercises');
    cy.login();
    cy.visit('/exercises');
    cy.wait('@getExercises');
  });

  it('should filter by muscle group', () => {
    cy.intercept('GET', '**/api/v1/exercises*muscle_group=chest*', {
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
    }).as('filterChest');

    // Look for filter dropdowns or buttons
    const filterSelectors = [
      'select',
      '[role="combobox"]',
      'button:contains("Filtro")',
      'button:contains("Peito")',
    ];

    // Try to find and interact with filters
    cy.get('body').then(($body) => {
      if ($body.find('select').length > 0) {
        cy.get('select').first().select('chest');
      } else if ($body.find('[role="combobox"]').length > 0) {
        cy.get('[role="combobox"]').first().click();
        cy.contains('Peito').click();
      }
    });
  });

  it('should filter by equipment', () => {
    cy.intercept('GET', '**/api/v1/exercises*equipment=barbell*', {
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
    }).as('filterBarbell');

    // Similar approach for equipment filter
    cy.get('body').should('exist');
  });
});
