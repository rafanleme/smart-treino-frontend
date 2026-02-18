describe('Protected Routes', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  const protectedRoutes = [
    '/',
    '/exercises',
    '/workouts',
    '/workouts/new',
    '/train',
    '/assessments',
    '/assessments/new',
    '/profile',
  ];

  protectedRoutes.forEach((route) => {
    it(`should redirect ${route} to login when not authenticated`, () => {
      cy.visit(route);
      cy.url().should('include', '/login');
    });
  });

  it('should allow access to protected routes when authenticated', () => {
    // Mock API calls with specific API paths
    cy.intercept('GET', '**/api/v1/exercises*', { body: { data: [] } });
    cy.intercept('GET', '**/api/v1/workouts*', { body: { data: [] } });

    cy.login();

    cy.visit('/exercises');
    cy.url().should('include', '/exercises');
    cy.url().should('not.include', '/login');
  });
});
