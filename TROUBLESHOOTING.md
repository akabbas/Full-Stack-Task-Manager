# Troubleshooting Guide

This document provides solutions to common issues that users might encounter while using the Task Manager application.

## Installation Issues

### PostgreSQL Connection Problems

**Symptoms:**
- Database connection errors
- Authentication failures
- Connection timeouts

**Solutions:**
1. Verify PostgreSQL is running:
   ```bash
   sudo service postgresql status
   ```
2. Check database credentials in `.env` file
3. Ensure the database user has proper permissions:
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE taskmanager TO your_user;
   ```
4. Verify PostgreSQL is listening on the correct port (default: 5432)

### Node.js Dependencies

**Symptoms:**
- Module not found errors
- Version conflicts
- Installation failures

**Solutions:**
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```
2. Delete node_modules and package-lock.json:
   ```bash
   rm -rf node_modules package-lock.json
   ```
3. Reinstall dependencies:
   ```bash
   npm install
   ```

## Runtime Issues

### Authentication Problems

**Symptoms:**
- Login failures
- Token validation errors
- Session expiration issues

**Solutions:**
1. Clear browser cache and cookies
2. Verify JWT_SECRET in `.env` file
3. Check token expiration settings
4. Ensure proper CORS configuration

### API Connection Issues

**Symptoms:**
- CORS errors
- Network timeouts
- 404 Not Found errors

**Solutions:**
1. Verify server is running:
   ```bash
   npm run dev
   ```
2. Check API endpoint URLs
3. Verify CORS settings in server configuration
4. Ensure proper environment variables are set

## Database Issues

### Migration Problems

**Symptoms:**
- Schema errors
- Migration failures
- Data inconsistency

**Solutions:**
1. Check migration files for syntax errors
2. Verify database connection settings
3. Run migrations in sequence:
   ```bash
   npm run migrate
   ```
4. Check for conflicting migrations

### Performance Issues

**Symptoms:**
- Slow queries
- High CPU usage
- Memory leaks

**Solutions:**
1. Optimize database queries
2. Add appropriate indexes
3. Monitor database performance
4. Implement query caching where appropriate

## Frontend Issues

### React Build Problems

**Symptoms:**
- Build failures
- Bundle size issues
- Dependency conflicts

**Solutions:**
1. Clear build cache:
   ```bash
   npm run clean
   ```
2. Update dependencies:
   ```bash
   npm update
   ```
3. Check for conflicting package versions
4. Verify webpack configuration

### UI Rendering Issues

**Symptoms:**
- Layout problems
- Styling inconsistencies
- Component rendering errors

**Solutions:**
1. Clear browser cache
2. Check for CSS conflicts
3. Verify component props
4. Test in different browsers

## Common Error Messages

### "Database connection failed"

1. Check PostgreSQL service status
2. Verify connection string
3. Ensure database exists
4. Check user permissions

### "Invalid token"

1. Clear local storage
2. Log out and log back in
3. Check token expiration
4. Verify JWT configuration

### "CORS policy blocked"

1. Check server CORS settings
2. Verify allowed origins
3. Ensure proper headers
4. Test with different browsers

## Getting Help

If you encounter issues not covered in this guide:

1. Check the [GitHub Issues](https://github.com/yourusername/task-manager/issues)
2. Search for similar problems
3. Create a new issue with:
   - Detailed error message
   - Steps to reproduce
   - Environment information
   - Relevant logs

## Contributing

If you have solutions to common issues not listed here, please consider contributing to this document by opening a pull request. 