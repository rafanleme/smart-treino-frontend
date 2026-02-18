describe('Edit Workout', () => {
  beforeEach(() => {
    cy.login();
    cy.intercept('GET', '**/api/v1/workouts/1', {
      fixture: 'workouts/workout-with-exercises.json',
    }).as('getWorkout');
    cy.intercept('GET', '**/api/v1/exercises*', {
      fixture: 'exercises/list.json',
    });
  });

  it('should load workout data in form', () => {
    cy.visit('/workouts/1/edit');
    cy.wait('@getWorkout');

    // Check if workout data loaded in form
    cy.contains('Informações do Treino').should('be.visible');
    cy.get('input[placeholder*="Treino"]').should('have.value', 'Treino A - Push');
    cy.get('textarea').should('contain.value', 'Peito, ombro e tríceps');

    // Check duration field (Ant Design InputNumber)
    cy.contains('Duração Estimada (minutos)').should('be.visible');
    cy.get('.ant-input-number-input').should('have.value', '60');
  });

  it('should show workout exercises', () => {
    cy.visit('/workouts/1/edit');
    cy.wait('@getWorkout');

    // Should show exercises section with count
    cy.contains('Exercícios (3)').should('be.visible');

    // Should show exercises from fixture
    cy.contains('Supino Reto').should('be.visible');
    cy.contains('Supino Inclinado com Halteres').should('be.visible');
    cy.contains('Desenvolvimento de Ombros').should('be.visible');
  });
});
