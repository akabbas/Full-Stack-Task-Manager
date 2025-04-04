# Contributing to Task Manager

Thank you for your interest in contributing to our Task Manager application! This document provides guidelines and steps for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/task-manager.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```
5. Set up environment variables:
   - Copy `.env.example` to `.env` in both server and client directories
   - Update the values with your local configuration

## Development Workflow

1. Make your changes
2. Run tests:
   ```bash
   # Server tests
   cd server
   npm test

   # Client tests
   cd ../client
   npm test
   ```
3. Ensure your code follows the project's coding standards
4. Commit your changes with a descriptive commit message
5. Push to your fork
6. Create a pull request

## Code Style

- Use consistent indentation (2 spaces)
- Follow the existing code style
- Write meaningful comments
- Keep functions small and focused
- Use meaningful variable and function names

## Pull Request Guidelines

- Provide a clear description of the changes
- Reference any related issues
- Ensure all tests pass
- Update documentation if necessary
- Keep the PR focused on a single feature or bug fix

## Reporting Issues

When reporting issues, please include:
- A clear description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, Node version, etc.)

## License

By contributing, you agree that your contributions will be licensed under the project's license. 