describe('Create Workout', () => {
  beforeEach(() => {
    cy.login();
    cy.intercept('GET', '**/api/v1/workouts*', {
      fixture: 'workouts/empty-list.json',
    }).as('getWorkouts');
  });

  it('should create a new workout', () => {
    cy.intercept('POST', '**/api/v1/workouts', (req) => {
      expect(req.body).to.have.property('name');
      req.reply({
        statusCode: 201,
        body: {
          data: {
            id: 1,
            user_id: 1,
            name: req.body.name,
            description: req.body.description || null,
            estimated_duration_min: req.body.estimated_duration_min || null,
            is_ai_generated: false,
            workout_exercises: [],
            exercises_count: 0,
            created_at: '2026-02-15T00:00:00.000000Z',
            updated_at: '2026-02-15T00:00:00.000000Z',
          },
        },
      });
    }).as('createWorkout');

    cy.intercept('GET', '**/api/v1/workouts/1', {
      fixture: 'workouts/workout-with-exercises.json',
    }).as('getWorkout');

    cy.intercept('GET', '**/api/v1/exercises*', {
      fixture: 'exercises/list.json',
    });

    cy.visit('/workouts');
    cy.wait('@getWorkouts');

    // Click "Novo Treino" or "Criar Primeiro Treino"
    cy.contains('button', /Novo Treino|Criar Primeiro Treino/i).click();

    cy.url().should('include', '/workouts/new');

    // Fill form
    cy.get('input[placeholder*="Treino"], input[id*="name"]')
      .first()
      .type('Treino A - Push');

    cy.get('textarea, input[id*="description"]').first().type('Peito, ombro, tríceps');

    cy.get('input[type="number"], input[id*="duration"]').first().type('60');

    // Submit
    cy.contains('button', 'Criar Treino').click();

    cy.wait('@createWorkout');
    cy.url().should('match', /\/workouts\/\d+\/edit/);
  });

  it('should show validation error for empty name', () => {
    cy.visit('/workouts/new');

    // Try to submit without filling name
    cy.contains('button', 'Criar Treino').click();

    // Should show validation message
    cy.contains(/nome.*obrigatório|insira o nome/i).should('be.visible');
  });

  it('should cancel workout creation', () => {
    cy.visit('/workouts/new');

    cy.contains('button', 'Cancelar').click();
    cy.url().should('include', '/workouts');
  });
});
