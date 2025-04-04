# Task Manager Application

A full-stack task management application built with React, Node.js, Express, and PostgreSQL.

!<img width="1447" alt="image" src="https://github.com/user-attachments/assets/92895f12-19cb-4243-a14c-6179d82c2cde" />


## Features

- User Authentication (Register/Login)
- Create, Read, Update, and Delete Tasks
- Task Status Management (Pending, In Progress, Completed)
- Task Priority Levels (Low, Medium, High)
- Responsive Design with Tailwind CSS
- Secure API with JWT Authentication
- PostgreSQL Database for Data Persistence

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios for API calls
- React Router for navigation
- Context API for state management

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT for authentication
- CORS for cross-origin requests

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/akabbas/Full-Stack-Task-Manager.git
cd Full-Stack-Task-Manager
```

2. Install dependencies for both client and server:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up the database:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE task_manager_dev;
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE task_manager_dev TO your_username;
```

4. Configure environment variables:
   - Copy `.env.example` to `.env` in both client and server directories
   - Update the database credentials in `server/.env`

5. Start the development servers:
```bash
# Start the backend server
cd server
npm start

# Start the frontend server (in a new terminal)
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
task-manager/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source files
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Context providers
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main application
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   └── index.js      # Server entry point
│   └── package.json
└── README.md
```

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Ammr Abbasher - ammrabbasher@gmail.com

Project Link: [https://github.com/akabbas/Full-Stack-Task-Manager](https://github.com/akabbas/Full-Stack-Task-Manager) 
