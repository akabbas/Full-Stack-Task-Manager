# Database Schema

This document outlines the database schema for the Task Manager application.

## Overview

The database uses PostgreSQL and consists of the following tables:
- `users` - User accounts and profiles
- `tasks` - Task management
- `task_categories` - Task categorization
- `task_comments` - Task comments and discussions
- `task_attachments` - File attachments for tasks
- `user_sessions` - User session management

## Tables

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### Tasks Table

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    priority VARCHAR(50) NOT NULL DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
```

### Task Categories Table

```sql
CREATE TABLE task_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    color VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_category_assignments (
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES task_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, category_id)
);

CREATE INDEX idx_task_categories_name ON task_categories(name);
```

### Task Comments Table

```sql
CREATE TABLE task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX idx_task_comments_user_id ON task_comments(user_id);
```

### Task Attachments Table

```sql
CREATE TABLE task_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_task_attachments_task_id ON task_attachments(task_id);
CREATE INDEX idx_task_attachments_user_id ON task_attachments(user_id);
```

### User Sessions Table

```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(token);
```

## Enums

### Task Status

```sql
CREATE TYPE task_status AS ENUM (
    'pending',
    'in-progress',
    'completed',
    'cancelled'
);
```

### Task Priority

```sql
CREATE TYPE task_priority AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
);
```

### User Role

```sql
CREATE TYPE user_role AS ENUM (
    'user',
    'admin',
    'superadmin'
);
```

## Functions

### Update Timestamp Function

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';
```

## Triggers

### Update Timestamp Triggers

```sql
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_categories_updated_at
    BEFORE UPDATE ON task_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_comments_updated_at
    BEFORE UPDATE ON task_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Views

### Task Overview View

```sql
CREATE VIEW task_overview AS
SELECT 
    t.id,
    t.title,
    t.status,
    t.priority,
    t.due_date,
    u.name as assigned_to,
    COUNT(tc.id) as comment_count,
    COUNT(ta.id) as attachment_count
FROM tasks t
LEFT JOIN users u ON t.user_id = u.id
LEFT JOIN task_comments tc ON t.id = tc.task_id
LEFT JOIN task_attachments ta ON t.id = ta.task_id
GROUP BY t.id, u.name;
```

## Indexes

### Composite Indexes

```sql
CREATE INDEX idx_tasks_status_priority ON tasks(status, priority);
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);
```

### Full Text Search Indexes

```sql
CREATE INDEX idx_tasks_search ON tasks USING gin(to_tsvector('english', title || ' ' || description));
```

## Constraints

### Task Status Constraint

```sql
ALTER TABLE tasks
ADD CONSTRAINT valid_task_status
CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled'));
```

### Task Priority Constraint

```sql
ALTER TABLE tasks
ADD CONSTRAINT valid_task_priority
CHECK (priority IN ('low', 'medium', 'high', 'urgent'));
```

## Database Maintenance

### Vacuum Settings

```sql
ALTER TABLE users SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE tasks SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE task_comments SET (autovacuum_vacuum_scale_factor = 0.2);
```

### Table Statistics

```sql
ANALYZE users;
ANALYZE tasks;
ANALYZE task_comments;
ANALYZE task_attachments;
```

## Backup Strategy

### Daily Backups

```sql
-- Create backup script
pg_dump -U postgres -d taskmanager -F c -f /backups/taskmanager_$(date +\%Y\%m\%d).backup
```

### Point-in-Time Recovery

```sql
-- Enable WAL archiving
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET archive_mode = on;
ALTER SYSTEM SET archive_command = 'test ! -f /mnt/server/archivedir/%f && cp %p /mnt/server/archivedir/%f';
```

## Performance Optimization

### Query Optimization

```sql
-- Enable query statistics
ALTER SYSTEM SET track_io_timing = on;
ALTER SYSTEM SET track_functions = all;
```

### Memory Configuration

```sql
-- Optimize memory settings
ALTER SYSTEM SET shared_buffers = '1GB';
ALTER SYSTEM SET effective_cache_size = '3GB';
ALTER SYSTEM SET work_mem = '16MB';
ALTER SYSTEM SET maintenance_work_mem = '256MB';
```

## Security

### Row Level Security

```sql
-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY task_access_policy ON tasks
    USING (user_id = current_user_id());
```

### Audit Logging

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(255) NOT NULL,
    operation VARCHAR(10) NOT NULL,
    user_id UUID REFERENCES users(id),
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_operation ON audit_logs(operation);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
``` 