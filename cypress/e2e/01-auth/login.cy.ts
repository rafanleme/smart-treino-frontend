describe('Login Flow', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
  });

  it('should redirect to login when not authenticated', () => {
    cy.visit('/workouts');
    cy.url().should('include', '/login');
  });

  it('should show login page with Google button', () => {
    cy.visit('/login');
    cy.contains('Entrar com Google').should('be.visible');
  });

  it('should login with Google successfully', () => {
    cy.intercept('GET', '**/auth/google/redirect', {
      statusCode: 200,
      body: {
        data: {
          url: 'http://mock-google-oauth',
        },
      },
    }).as('googleRedirect');

    cy.intercept('POST', '**/auth/google', {
      fixture: 'auth/login-success.json',
    }).as('login');

    cy.intercept('GET', '**/auth/me', {
      statusCode: 200,
      body: {
        data: {
          id: 1,
          name: 'Cypress Test User',
          email: 'cypress@test.com',
          avatar_url: 'https://via.placeholder.com/150',
          created_at: '2026-02-15T00:00:00.000000Z',
        },
      },
    }).as('getMe');

    cy.visit('/login');

    // Simulate Google OAuth callback by setting token
    cy.window().then((win) => {
      win.localStorage.setItem('auth_token', 'mock-jwt-token');
    });

    // Intercept workouts list
    cy.intercept('GET', '**/workouts*', {
      body: { data: [] },
    });

    cy.visit('/');
    cy.url().should('not.include', '/login');
  });
});
