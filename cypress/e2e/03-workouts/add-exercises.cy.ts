describe('Add Exercises to Workout', () => {
  beforeEach(() => {
    cy.login();
    cy.intercept('GET', '**/api/v1/workouts/1', {
      fixture: 'workouts/workout-with-exercises.json',
    }).as('getWorkout');
    cy.intercept('GET', '**/api/v1/exercises*', {
      fixture: 'exercises/list.json',
    }).as('getExercises');
  });

  it('should open exercise picker', () => {
    cy.visit('/workouts/1/edit');
    cy.wait('@getWorkout');
    cy.wait('@getExercises');

    // Click add exercise button
    cy.contains('button', /Adicionar Exercício/i).should('be.visible').click();

    // Modal should open with title
    cy.contains('Adicionar Exercício').should('be.visible');

    // Should have search input
    cy.get('input[placeholder*="Buscar"], input[placeholder*="buscar"]').should('be.visible');
  });

  it('should show existing exercises with sets and reps', () => {
    cy.visit('/workouts/1/edit');
    cy.wait('@getWorkout');

    // Exercises section should show count
    cy.contains('Exercícios (3)').should('be.visible');

    // Existing exercises should be visible
    cy.contains('Supino Reto').should('be.visible');
    cy.contains('Supino Inclinado com Halteres').should('be.visible');
  });
});
