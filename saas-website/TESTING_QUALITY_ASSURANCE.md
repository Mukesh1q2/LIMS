# 🧪 LIMS SaaS Platform - Testing & Quality Assurance Strategy

## 📋 TESTING FRAMEWORK OVERVIEW

### Testing Pyramid
```
     /\
    /  \     E2E Tests (10%)
   /____\
  /      \
 /        \  Integration Tests (20%)
/__________\
            \
             \  Unit Tests (70%)
              \
```

## 🧪 UNIT TESTING

### Test Structure
```typescript
// __tests__/components/FormValidation.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormField } from '@/components/FormValidation';

describe('FormField Component', () => {
  test('renders with correct label', () => {
    render(
      <FormField
        label="Email"
        name="email"
        type="email"
        required
        value=""
        onChange={jest.fn()}
        validation={{ isValid: true, error: null, touched: false }}
      />
    );
    
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
  });

  test('shows validation error when invalid', async () => {
    const mockOnChange = jest.fn();
    render(
      <FormField
        label="Email"
        name="email"
        type="email"
        required
        value="invalid-email"
        onChange={mockOnChange}
        validation={{ 
          isValid: false, 
          error: 'Invalid email format', 
          touched: true 
        }}
      />
    );
    
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
  });

  test('calls onChange when user types', async () => {
    const mockOnChange = jest.fn();
    render(
      <FormField
        label="Email"
        name="email"
        type="email"
        required
        value=""
        onChange={mockOnChange}
        validation={{ isValid: true, error: null, touched: false }}
      />
    );
    
    const input = screen.getByLabelText('Email *');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('test@example.com');
    });
  });
});
```

### API Route Testing
```typescript
// __tests__/api/contact.test.ts
import { POST } from '@/app/api/contact/route';
import { NextRequest } from 'next/server';

describe('/api/contact', () => {
  test('returns 400 for missing required fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({ name: 'John' }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toContain('Invalid input provided');
  });

  test('returns 200 for valid submission', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        message: 'This is a test message',
      }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.leadId).toBeDefined();
  });

  test('sanitizes input to prevent XSS', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: '<script>alert("xss")</script>John',
        email: 'john@example.com',
        phone: '+1234567890',
        message: 'Hello world',
      }),
    });
    
    const response = await POST(request);
    
    expect(response.status).toBe(400); // Should reject due to sanitization
  });
});
```

## 🔗 INTEGRATION TESTING

### Database Integration Tests
```typescript
// __tests__/integration/database.test.ts
import { PrismaClient } from '@prisma/client';
import { createOrganization, createUser } from '@/lib/database';

const prisma = new PrismaClient();

describe('Database Operations', () => {
  beforeEach(async () => {
    // Clean up test data
    await prisma.user.deleteMany({});
    await prisma.organization.deleteMany({});
  });

  test('creates organization with proper isolation', async () => {
    const organization = await createOrganization({
      name: 'Test Institute',
      displayName: 'Test Institute',
      slug: 'test-institute',
      subscriptionPlan: 'starter',
    });
    
    expect(organization.id).toBeDefined();
    expect(organization.slug).toBe('test-institute');
  });

  test('enforces multi-tenant isolation', async () => {
    const org1 = await createOrganization({
      name: 'Institute 1',
      displayName: 'Institute 1',
      slug: 'institute-1',
    });
    
    const org2 = await createOrganization({
      name: 'Institute 2',
      displayName: 'Institute 2',
      slug: 'institute-2',
    });
    
    // Users from org1 should not be able to access org2's data
    const user1 = await createUser({
      organizationId: org1.id,
      email: 'user1@example.com',
      firstName: 'User: 'One',
    });
    
    const user2 = await createUser({
      organizationId: org2.id,
      email: '',
      firstNameuser2@example.com',
      lastName: 'User',
      lastName: 'Two',
    });
    
    // Query should only return users from the same organization
    const org1Users = await prisma.user.findMany({
      where: { organizationId: org1.id },
    });
    
    expect(org1Users).toHaveLength(1);
    expect(org1Users[0].id).toBe(user1.id);
  });
});
```

### API Integration Tests
```typescript
// __tests__/integration/api.test.ts
import { getTestServer } from './testServer';

describe('API Integration', () => {
  test('contact form workflow end-to-end', async () => {
    const server = await getTestServer();
    
    // Submit contact form
    const response = await server.post('/api/contact').send({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      message: 'I am interested in your platform',
    });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.leadId).toBeDefined();
    
    // Verify data was stored (in real implementation)
    // const lead = await prisma.lead.findUnique({ where: { id: response.body.leadId } });
    // expect(lead).toBeDefined();
  });

  test('rate limiting works correctly', async () => {
    const server = await getTestServer();
    
    // Make multiple requests to trigger rate limiting
    const promises = Array(10).fill(null).map(() => 
      server.post('/api/contact').send({
        name: 'Spammer',
        email: 'spam@example.com',
        phone: '+1234567890',
        message: 'Spam message',
      })
    );
    
    const responses = await Promise.all(promises);
    
    // Most requests should be rate limited
    const rateLimitedCount = responses.filter(r => r.status === 429).length;
    expect(rateLimitedCount).toBeGreaterThan(5);
  });
});
```

## 🎭 END-TO-END TESTING

### Cypress Configuration
```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
    },
  },
});
```

### E2E Test Examples
```typescript
// cypress/e2e/contact-form.cy.ts
describe('Contact Form Flow', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-cy="contact-section"]').scrollIntoView();
  });

  it('submits contact form successfully', () => {
    cy.get('[data-cy="contact-name"]').type('John Doe');
    cy.get('[data-cy="contact-email"]').type('john@example.com');
    cy.get('[data-cy="contact-phone"]').type('+1234567890');
    cy.get('[data-cy="contact-message"]').type('I am interested in your platform');
    
    cy.get('[data-cy="contact-submit"]').click();
    
    cy.get('[data-cy="success-message"]')
      .should('be.visible')
      .and('contain', 'Thank you for your interest');
  });

  it('shows validation errors for invalid input', () => {
    cy.get('[data-cy="contact-email"]').type('invalid-email');
    cy.get('[data-cy="contact-submit"]').click();
    
    cy.get('[data-cy="email-error"]')
      .should('be.visible')
      .and('contain', 'Invalid email format');
  });

  it('handles network errors gracefully', () => {
    // Mock network error
    cy.intercept('POST', '/api/contact', { forceNetworkError: true });
    
    cy.get('[data-cy="contact-name"]').type('John Doe');
    cy.get('[data-cy="contact-email"]').type('john@example.com');
    cy.get('[data-cy="contact-phone"]').type('+1234567890');
    cy.get('[data-cy="contact-message"]').type('Test message');
    
    cy.get('[data-cy="contact-submit"]').click();
    
    cy.get('[data-cy="error-message"]')
      .should('be.visible')
      .and('contain', 'Network error');
  });
});
```

## 🔒 SECURITY TESTING

### Security Test Cases
```typescript
// __tests__/security/auth.test.ts
describe('Authentication Security', () => {
  test('prevents SQL injection in login', async () => {
    const maliciousPayload = "admin' OR '1'='1";
    
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: maliciousPayload,
        password: 'password',
      }),
    });
    
    expect(response.status).toBe(400);
  });

  test('prevents XSS in user input', async () => {
    const xssPayload = '<script>alert("xss")</script>';
    
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: xssPayload,
        email: 'test@example.com',
        phone: '+1234567890',
        message: 'Test message',
      }),
    });
    
    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  test('enforces rate limiting', async () => {
    const requests = Array(20).fill(null).map(() =>
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          phone: '+1234567890',
          message: 'Test message',
        }),
      })
    );
    
    const responses = await Promise.all(requests);
    const rateLimitedCount = responses.filter(r => r.status === 429).length;
    
    expect(rateLimitedCount).toBeGreaterThan(10);
  });
});
```

## 📊 PERFORMANCE TESTING

### Load Testing with Artillery
```yaml
# tests/load/contact-form.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 20
  defaults:
    headers:
      'Content-Type': 'application/json'

scenarios:
  - name: 'Contact Form Load Test'
    weight: 100
    flow:
      - post:
          url: '/api/contact'
          json:
            name: 'Load Test User'
            email: 'loadtest@example.com'
            phone: '+1234567890'
            message: 'This is a load test message'
          expect:
            - statusCode: 200
            - hasProperty: 'success'
```

### Bundle Size Testing
```typescript
// __tests__/performance/bundle.test.ts
import { render } from '@testing-library/react';
import { createElement } from 'react';

describe('Bundle Size Tests', () => {
  test('contact form component is within size limit', () => {
    const element = createElement('div', {
      'data-cy': 'contact-form',
    });
    
    // This is a simplified example
    // In practice, you'd use webpack-bundle-analyzer or similar
    expect(element).toBeDefined();
  });

  test('no large dependencies in client bundle', () => {
    // Check that large libraries are not included in client bundle
    const clientBundleSize = calculateBundleSize('.next/static/chunks/**/*.js');
    expect(clientBundleSize).toBeLessThan(500 * 1024); // 500KB limit
  });
});
```

## 🎯 ACCESSIBILITY TESTING

### A11y Tests
```typescript
// __tests__/accessibility/contact-form.a11y.test.ts
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ContactSection } from '@/components/ContactSection';

expect.extend(toHaveNoViolations);

describe('Contact Form Accessibility', () => {
  test('contact form has no accessibility violations', async () => {
    const { container } = render(<ContactSection />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });

  test('all form fields have proper labels', () => {
    render(<ContactSection />);
    
    expect(screen.getByLabelText('Full Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address *')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByLabelText('How can we help?')).toBeInTheDocument();
  });

  test('error messages are announced to screen readers', async () => {
    render(<ContactSection />);
    
    // Trigger validation error
    const emailInput = screen.getByLabelText('Email Address *');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    // Check for error announcement
    const errorMessage = screen.getByText(/Invalid email format/i);
    expect(errorMessage).toHaveAttribute('aria-live', 'polite');
  });
});
```

## 📱 MOBILE TESTING

### Mobile E2E Tests
```typescript
// cypress/e2e/mobile-contact-form.cy.ts
describe('Mobile Contact Form', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.visit('/');
  });

  it('works correctly on mobile devices', () => {
    cy.get('[data-cy="mobile-menu-button"]').click();
    cy.get('[data-cy="contact-link"]').click();
    
    // Test form on mobile
    cy.get('[data-cy="contact-name"]').type('Mobile User');
    cy.get('[data-cy="contact-email"]').type('mobile@example.com');
    cy.get('[data-cy="contact-phone"]').type('+1234567890');
    cy.get('[data-cy="contact-message"]').type('Mobile test message');
    
    cy.get('[data-cy="contact-submit"]').should('be.visible').click();
    
    cy.get('[data-cy="success-message"]').should('be.visible');
  });

  it('keyboard navigation works on mobile', () => {
    cy.get('[data-cy="contact-name"]').focus();
    cy.focused().should('have.attr', 'data-cy', 'contact-name');
    
    cy.get('body').type('{tab}');
    cy.focused().should('have.attr', 'data-cy', 'contact-email');
    
    cy.get('body').type('{tab}');
    cy.focused().should('have.attr', 'data-cy', 'contact-phone');
  });
});
```

## 🧪 TESTING INFRASTRUCTURE

### Test Configuration
```typescript
// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: [
    '<rootDir>/__tests__/**/*.test.{ts,tsx}',
    '<rootDir>/**/*.test.{ts,tsx}',
  ],
};

export default config;
```

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: lims_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run linting
        run: npm run lint
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/lims_test
      
      - name: Build application
        run: npm run build
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          NEXT_PUBLIC_BASE_URL: http://localhost:3000
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run accessibility tests
        run: npm run test:a11y
```

## 📈 TESTING METRICS

### Coverage Targets
- **Unit Tests**: 90% coverage
- **Integration Tests**: 80% coverage
- **E2E Tests**: Critical user journeys 100%
- **Security Tests**: All endpoints covered
- **Performance Tests**: All APIs and critical pages

### Success Criteria
- All tests pass (0 failures)
- No security vulnerabilities in dependencies
- Performance meets targets (load time < 2s)
- Accessibility score 100%
- Mobile compatibility verified

This comprehensive testing strategy ensures the LIMS SaaS platform is robust, secure, and provides an excellent user experience across all devices and use cases.