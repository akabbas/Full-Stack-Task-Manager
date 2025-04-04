# Development Guide

This document provides detailed instructions for setting up and working with the Task Manager project in a development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL (v12 or higher)
- Git

## Setting Up the Development Environment

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/task-manager.git
cd task-manager
```

### 2. Install Dependencies

#### Backend Dependencies

```bash
cd server
npm install
```

#### Frontend Dependencies

```bash
cd ../client
npm install
```

### 3. Database Setup

1. Start PostgreSQL service:
   ```bash
   sudo service postgresql start
   ```

2. Create the database:
   ```sql
   CREATE DATABASE taskmanager;
   ```

3. Create a database user:
   ```sql
   CREATE USER your_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE taskmanager TO your_user;
   ```

4. Run database migrations:
   ```bash
   cd server
   npm run migrate
   ```

### 4. Environment Configuration

1. Create `.env` files:

   Backend (server/.env):
   ```
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=taskmanager
   DB_USER=your_user
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:3000
   ```

   Frontend (client/.env):
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

### 5. Start Development Servers

#### Backend Server

```bash
cd server
npm run dev
```

#### Frontend Server

```bash
cd client
npm start
```

## Development Workflow

### Code Structure

```
task-manager/
├── client/                 # React frontend
│   ├── public/            # Static files
│   └── src/               # Source files
│       ├── components/    # React components
│       ├── pages/         # Page components
│       ├── services/      # API services
│       └── utils/         # Utility functions
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── utils/            # Utility functions
└── docs/                 # Documentation
```

### Git Workflow

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

3. Push your changes:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a pull request on GitHub

### Testing

#### Backend Tests

```bash
cd server
npm test
```

#### Frontend Tests

```bash
cd client
npm test
```

### Code Quality

- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks

Run linting:
```bash
npm run lint
```

Run formatting:
```bash
npm run format
```

## Debugging

### Backend Debugging

1. Use Node.js debugger:
   ```bash
   npm run debug
   ```

2. Add breakpoints in your code:
   ```javascript
   debugger;
   ```

### Frontend Debugging

1. Use React Developer Tools
2. Use browser developer tools
3. Add console logs:
   ```javascript
   console.log('Debug information:', data);
   ```

## API Documentation

The API documentation is available at:
- Development: http://localhost:5000/api-docs
- Production: https://your-production-url/api-docs

## Common Development Tasks

### Creating a New API Endpoint

1. Create a new route in `server/routes/`
2. Create a controller in `server/controllers/`
3. Add the route to `server/app.js`
4. Test the endpoint using Postman or curl

### Adding a New Frontend Feature

1. Create new components in `client/src/components/`
2. Add new pages in `client/src/pages/`
3. Create API services in `client/src/services/`
4. Update routing in `client/src/App.js`

### Database Migrations

1. Create a new migration:
   ```bash
   npm run create-migration <migration-name>
   ```

2. Run migrations:
   ```bash
   npm run migrate
   ```

3. Rollback migrations:
   ```bash
   npm run rollback
   ```

## Performance Optimization

### Backend Optimization

- Implement caching where appropriate
- Optimize database queries
- Use connection pooling
- Implement rate limiting

### Frontend Optimization

- Code splitting
- Lazy loading
- Image optimization
- Bundle size optimization

## Security Considerations

- Never commit sensitive information
- Use environment variables for secrets
- Implement proper input validation
- Use HTTPS in production
- Implement proper authentication and authorization

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions.

## Getting Help

- Check the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) guide
- Search GitHub issues
- Ask for help in the project's discussion forum 