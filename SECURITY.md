# Security Policy

## Supported Versions

We currently provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within the Task Manager project, please follow these steps:

1. **Do not** disclose the vulnerability publicly until it has been addressed
2. Email your findings to [your-email@example.com]
3. Include as much information as possible about the vulnerability:
   - Type of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fixes (if any)

We will:
- Acknowledge receipt of your vulnerability report
- Provide a more detailed response within 48 hours
- Keep you informed about our progress
- Credit you in our security advisories (if you wish)

## Security Measures

The Task Manager application implements several security measures:

- Password hashing using bcrypt
- JWT-based authentication
- CORS protection
- Input validation and sanitization
- SQL injection prevention
- Rate limiting on authentication endpoints
- Secure session management

## Best Practices

When using the Task Manager application:

1. Always use strong, unique passwords
2. Keep your authentication tokens secure
3. Use HTTPS in production environments
4. Regularly update dependencies
5. Follow the principle of least privilege for database access
6. Implement proper error handling
7. Use environment variables for sensitive configuration

## Security Updates

We regularly:
- Update dependencies to their latest secure versions
- Perform security audits
- Implement security patches
- Review and update security documentation

## Contact

For security-related concerns, please contact [your-email@example.com] 