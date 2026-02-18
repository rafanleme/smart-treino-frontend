/// <reference types="cypress" />

// ***********************************************
// Custom Cypress Commands
// ***********************************************

/**
 * Login bypass command
 * Sets up authentication by mocking API responses and setting token
 */
Cypress.Commands.add('login', (user = 'default') => {
  // Setup intercepts
  cy.intercept('GET', '**/api/v1/auth/me', {
    statusCode: 200,
    body: {
      data: {
        id: 1,
        name: 'Cypress Test User',
        email: 'cypress@test.com',
        avatar_url: 'https://via.placeholder.com/150',
        created_at: new Date().toISOString(),
      },
    },
  }).as('getMe');

  cy.intercept('GET', '**/api/v1/auth/google/redirect', {
    statusCode: 200,
    body: {
      data: {
        url: 'http://mock-google-oauth',
      },
    },
  });

  cy.intercept('POST', '**/api/v1/auth/google', {
    statusCode: 200,
    body: {
      data: {
        access_token: 'mock-jwt-token',
        token_type: 'bearer',
        expires_in: 3600,
        user: {
          id: 1,
          name: 'Cypress Test User',
          email: 'cypress@test.com',
          avatar_url: 'https://via.placeholder.com/150',
        },
      },
    },
  }).as('login');

  // Visit first to get window
  cy.visit('/');

  // Set token in localStorage using the correct key (st_token)
  cy.window().then((win) => {
    win.localStorage.setItem('st_token', 'mock-jwt-token');
  });

  // Reload to trigger AuthContext to load token
  cy.reload();

  // Wait for auth to complete
  cy.wait('@getMe');
});

/**
 * Create workout command
 */
Cypress.Commands.add('createWorkout', (name: string, description?: string) => {
  cy.intercept('POST', '**/api/v1/workouts', (req) => {
    req.reply({
      statusCode: 201,
      body: {
        data: {
          id: Math.floor(Math.random() * 1000),
          user_id: 1,
          name: req.body.name,
          description: req.body.description || null,
          estimated_duration_min: req.body.estimated_duration_min || 60,
          is_ai_generated: false,
          workout_exercises: [],
          exercises_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
    });
  }).as('createWorkout');

  cy.visit('/workouts/new');
  cy.get('input[placeholder*="Treino"]').type(name);
  if (description) {
    cy.get('textarea').type(description);
  }
  cy.contains('button', 'Criar Treino').click();
  cy.wait('@createWorkout');
});

/**
 * Add exercise to workout
 */
Cypress.Commands.add('addExerciseToWorkout', (exerciseName: string) => {
  cy.intercept('POST', '**/api/v1/workouts/*/exercises', {
    statusCode: 201,
    body: {
      data: {
        id: Math.floor(Math.random() * 1000),
        workout_id: 1,
        exercise_id: 1,
        order: 1,
        sets: 3,
        reps: '10',
        rest_seconds: 60,
        notes: null,
      },
    },
  }).as('addExercise');

  cy.contains('button', 'Adicionar Exercício').click();
  cy.get('input[placeholder*="Buscar"]').type(exerciseName);
  cy.wait(500); // Wait for search debounce
  cy.contains(exerciseName).click();
});

// TypeScript declarations
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Login bypass - mocks Google OAuth and sets auth state
       * @param user - Optional user type (default: 'default')
       */
      login(user?: string): Chainable<void>;

      /**
       * Create a new workout
       * @param name - Workout name
       * @param description - Optional workout description
       */
      createWorkout(name: string, description?: string): Chainable<void>;

      /**
       * Add an exercise to the current workout
       * @param exerciseName - Name of the exercise to add
       */
      addExerciseToWorkout(exerciseName: string): Chainable<void>;
    }
  }
}

export {};
