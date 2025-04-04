# Testing Guide

This document provides comprehensive guidelines for testing the Task Manager application.

## Testing Strategy

### 1. Unit Testing
- Individual components and functions
- Isolated from dependencies
- Fast execution
- High coverage

### 2. Integration Testing
- Component interactions
- API endpoints
- Database operations
- Authentication flow

### 3. End-to-End Testing
- Complete user workflows
- Cross-browser testing
- Performance testing
- Security testing

## Testing Tools

### Frontend Testing
- Jest
- React Testing Library
- Cypress
- ESLint
- Prettier

### Backend Testing
- Jest
- Supertest
- PostgreSQL test database
- ESLint
- Prettier

## Setting Up Testing Environment

### 1. Install Dependencies

```bash
# Frontend
cd client
npm install --save-dev jest @testing-library/react @testing-library/jest-dom cypress

# Backend
cd server
npm install --save-dev jest supertest
```

### 2. Configure Jest

Frontend (`client/jest.config.js`):
```javascript
module.exports = {
  preset: 'react-scripts',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};
```

Backend (`server/jest.config.js`):
```javascript
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  coveragePathIgnorePatterns: ['/node_modules/'],
};
```

### 3. Setup Test Database

```bash
# Create test database
createdb taskmanager_test

# Add to server/.env.test
DB_NAME=taskmanager_test
```

## Writing Tests

### Frontend Tests

#### Component Tests

```javascript
// Example: Button component test
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with correct text', () => {
  render(<Button>Click me</Button>);
  const buttonElement = screen.getByText(/click me/i);
  expect(buttonElement).toBeInTheDocument();
});
```

#### Hook Tests

```javascript
// Example: useAuth hook test
import { renderHook, act } from '@testing-library/react-hooks';
import useAuth from './useAuth';

test('login updates auth state', () => {
  const { result } = renderHook(() => useAuth());
  
  act(() => {
    result.current.login('test@example.com', 'password');
  });
  
  expect(result.current.isAuthenticated).toBe(true);
});
```

### Backend Tests

#### API Tests

```javascript
// Example: Task API test
const request = require('supertest');
const app = require('../app');
const db = require('../db');

describe('Task API', () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  test('GET /api/tasks returns all tasks', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${testToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
```

#### Database Tests

```javascript
// Example: Task model test
const Task = require('../models/Task');
const db = require('../db');

describe('Task Model', () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  test('creates a new task', async () => {
    const task = await Task.create({
      title: 'Test Task',
      description: 'Test Description',
      userId: 'test-user-id'
    });
    
    expect(task.title).toBe('Test Task');
    expect(task.description).toBe('Test Description');
  });
});
```

## Running Tests

### Frontend Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run Cypress tests
npm run cypress:open
```

### Backend Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Test Coverage

### Coverage Requirements
- Minimum 80% coverage for all files
- 100% coverage for critical paths
- Regular coverage reports

### Generating Coverage Reports

```bash
# Frontend
cd client
npm test -- --coverage --coverageReporters="text-summary" --coverageReporters="html"

# Backend
cd server
npm test -- --coverage --coverageReporters="text-summary" --coverageReporters="html"
```

## Continuous Integration

### GitHub Actions Configuration

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:12
        env:
          POSTGRES_DB: taskmanager_test
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'
          
      - name: Install dependencies
        run: |
          npm install
          cd client && npm install
          cd ../server && npm install
          
      - name: Run tests
        run: |
          cd client && npm test
          cd ../server && npm test
```

## Performance Testing

### Frontend Performance

```javascript
// Example: Performance test with Cypress
describe('Performance', () => {
  it('loads dashboard within 2 seconds', () => {
    cy.visit('/dashboard');
    cy.get('[data-testid="dashboard"]').should('be.visible');
    cy.window().then((win) => {
      const performance = win.performance;
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      expect(loadTime).to.be.lessThan(2000);
    });
  });
});
```

### Backend Performance

```javascript
// Example: API performance test
const request = require('supertest');
const app = require('../app');

describe('API Performance', () => {
  test('GET /api/tasks responds within 100ms', async () => {
    const start = Date.now();
    await request(app).get('/api/tasks');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100);
  });
});
```

## Security Testing

### Authentication Tests

```javascript
// Example: Authentication test
describe('Authentication', () => {
  test('rejects invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'invalid@example.com',
        password: 'wrongpassword'
      });
    
    expect(response.status).toBe(401);
  });
});
```

### Authorization Tests

```javascript
// Example: Authorization test
describe('Authorization', () => {
  test('prevents unauthorized access', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', 'Bearer invalid-token');
    
    expect(response.status).toBe(403);
  });
});
```

## Best Practices

1. **Test Organization**
   - Group related tests
   - Use descriptive test names
   - Follow AAA pattern (Arrange, Act, Assert)

2. **Test Data**
   - Use fixtures for complex data
   - Clean up test data after tests
   - Use factories for object creation

3. **Test Isolation**
   - Mock external dependencies
   - Reset state between tests
   - Use test database

4. **Error Handling**
   - Test error cases
   - Verify error messages
   - Check error status codes

5. **Maintenance**
   - Keep tests up to date
   - Remove obsolete tests
   - Regular test reviews

## Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common testing issues and solutions. 