describe('Delete Workout', () => {
  beforeEach(() => {
    cy.login();
    cy.intercept('GET', '**/api/v1/workouts*', {
      fixture: 'workouts/list.json',
    }).as('getWorkouts');
  });

  it('should show delete confirmation', () => {
    cy.visit('/workouts');
    cy.wait('@getWorkouts');

    // Workouts should be visible
    cy.contains('Treino A - Push').should('be.visible');
    cy.contains('Treino B - Pull').should('be.visible');

    // Find delete button
    cy.contains('button', 'Excluir').first().click();

    // Popconfirm should appear with confirmation text
    cy.contains('Excluir treino').should('be.visible');
    cy.contains('Tem certeza que deseja excluir este treino?').should('be.visible');

    // Should have cancel button
    cy.contains('button', 'Não').should('be.visible');
  });

  it('should cancel workout deletion', () => {
    cy.visit('/workouts');
    cy.wait('@getWorkouts');

    // Click delete
    cy.contains('button', 'Excluir').first().click();

    // Cancel in popconfirm
    cy.get('.ant-popconfirm, .ant-popover').should('be.visible');
    cy.contains('button', 'Não').click();

    // Workout should still be there
    cy.contains('Treino A - Push').should('be.visible');
  });
});
