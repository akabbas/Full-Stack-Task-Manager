# Frontend Architecture

This document outlines the architecture and design patterns used in the Task Manager frontend application.

## Overview

The frontend is built using React with TypeScript and follows a modern, component-based architecture. It uses Redux for state management and follows the Atomic Design methodology for component organization.

## Project Structure

```
client/
├── public/                 # Static files
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable components
│   │   ├── atoms/        # Basic building blocks
│   │   ├── molecules/    # Simple combinations of atoms
│   │   ├── organisms/    # Complex UI components
│   │   ├── templates/    # Page layouts
│   │   └── pages/        # Full pages
│   ├── config/           # Configuration files
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API services
│   ├── store/            # Redux store
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Root component
│   └── index.tsx         # Entry point
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript configuration
```

## Component Architecture

### Atomic Design

1. **Atoms**
   - Basic building blocks
   - Examples: Button, Input, Label
   - No dependencies on other components

2. **Molecules**
   - Simple combinations of atoms
   - Examples: SearchBar, TaskCard
   - Limited dependencies

3. **Organisms**
   - Complex UI components
   - Examples: TaskList, UserProfile
   - May include multiple molecules

4. **Templates**
   - Page layouts
   - Examples: DashboardLayout, AuthLayout
   - Define structure and spacing

5. **Pages**
   - Full pages
   - Examples: Dashboard, Login
   - Combine templates and organisms

## State Management

### Redux Store Structure

```typescript
interface RootState {
  auth: {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
  };
  tasks: {
    items: Task[];
    loading: boolean;
    error: string | null;
    filters: TaskFilters;
    pagination: Pagination;
  };
  ui: {
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
    notifications: Notification[];
  };
}
```

### Redux Actions

```typescript
// Action Types
const LOGIN_REQUEST = 'auth/LOGIN_REQUEST';
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
const LOGIN_FAILURE = 'auth/LOGIN_FAILURE';

// Action Creators
const login = (credentials: LoginCredentials) => ({
  type: LOGIN_REQUEST,
  payload: credentials,
});
```

### Redux Reducers

```typescript
const authReducer = (state = initialState, action: AuthAction) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case LOGIN_SUCCESS:
      return { ...state, loading: false, user: action.payload };
    case LOGIN_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
```

## Routing

### Route Configuration

```typescript
const routes = [
  {
    path: '/',
    element: <PrivateRoute><Dashboard /></PrivateRoute>,
  },
  {
    path: '/login',
    element: <PublicRoute><Login /></PublicRoute>,
  },
  {
    path: '/tasks',
    element: <PrivateRoute><TaskList /></PrivateRoute>,
  },
  {
    path: '/tasks/:id',
    element: <PrivateRoute><TaskDetails /></PrivateRoute>,
  },
];
```

### Route Guards

```typescript
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};
```

## API Integration

### API Service Structure

```typescript
// services/api.ts
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);
```

### API Hooks

```typescript
// hooks/useTasks.ts
const useTasks = () => {
  const dispatch = useDispatch();
  
  const fetchTasks = useCallback(async () => {
    try {
      dispatch(tasksActions.fetchStart());
      const response = await api.get('/tasks');
      dispatch(tasksActions.fetchSuccess(response.data));
    } catch (error) {
      dispatch(tasksActions.fetchFailure(error.message));
    }
  }, [dispatch]);
  
  return { fetchTasks };
};
```

## Styling

### CSS-in-JS with Styled Components

```typescript
// components/atoms/Button.tsx
const Button = styled.button<ButtonProps>`
  background-color: ${({ theme, variant }) => 
    variant === 'primary' ? theme.colors.primary : theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: none;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;
```

### Theme Configuration

```typescript
// styles/theme.ts
const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    text: '#212529',
    background: '#ffffff',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: '4px',
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '992px',
    large: '1200px',
  },
};
```

## Performance Optimization

### Code Splitting

```typescript
// Lazy loading components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const TaskList = lazy(() => import('./pages/TaskList'));
const TaskDetails = lazy(() => import('./pages/TaskDetails'));

// Suspense wrapper
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/tasks" element={<TaskList />} />
    <Route path="/tasks/:id" element={<TaskDetails />} />
  </Routes>
</Suspense>
```

### Memoization

```typescript
// Memoized components
const TaskCard = memo(({ task }: TaskCardProps) => {
  return (
    <Card>
      <Title>{task.title}</Title>
      <Description>{task.description}</Description>
    </Card>
  );
});

// Memoized callbacks
const handleTaskUpdate = useCallback((taskId: string, updates: TaskUpdate) => {
  dispatch(updateTask(taskId, updates));
}, [dispatch]);
```

## Error Handling

### Error Boundaries

```typescript
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### Global Error Handler

```typescript
// utils/errorHandler.ts
const handleError = (error: Error) => {
  console.error(error);
  
  if (error instanceof APIError) {
    showNotification({
      type: 'error',
      message: error.message,
    });
  } else {
    showNotification({
      type: 'error',
      message: 'An unexpected error occurred',
    });
  }
};
```

## Testing

### Component Tests

```typescript
// components/atoms/Button.test.tsx
describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests

```typescript
// pages/Dashboard.test.tsx
describe('Dashboard', () => {
  it('loads and displays tasks', async () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });
  });
});
```

## Accessibility

### ARIA Attributes

```typescript
const Button = ({ children, ...props }: ButtonProps) => (
  <button
    role="button"
    aria-label={props['aria-label']}
    {...props}
  >
    {children}
  </button>
);
```

### Keyboard Navigation

```typescript
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onClick();
  }
};
```

## Internationalization

### i18n Configuration

```typescript
// config/i18n.ts
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          'task.title': 'Task Title',
          'task.description': 'Task Description',
        },
      },
    },
    lng: 'en',
    fallbackLng: 'en',
  });
```

### Translation Usage

```typescript
const TaskCard = ({ task }: TaskCardProps) => (
  <Card>
    <Title>{t('task.title')}: {task.title}</Title>
    <Description>{t('task.description')}: {task.description}</Description>
  </Card>
);
``` 