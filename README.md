# Splitwise Clone

A full-stack expense splitting application built with Spring Boot (Backend) and Angular (Frontend).

## Features

- **User Management**: User registration, login, and profile management
- **Group Management**: Create and manage groups for expense sharing
- **Expense Tracking**: Add, edit, and delete expenses
- **Multiple Split Types**: Equal, percentage, and custom expense splitting
- **Real-time Calculations**: Automatic calculation of who owes what
- **Responsive Design**: Modern UI that works on all devices

## Tech Stack

### Backend
- **Spring Boot 3.2.0** - Main framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Data persistence
- **H2 Database** - In-memory database (for development)
- **Maven** - Dependency management

### Frontend
- **Angular 17** - Frontend framework
- **Angular Material** - UI component library
- **TypeScript** - Programming language
- **SCSS** - Styling

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- npm or yarn package manager

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd splitwise-clone
```

### 2. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup
```bash
cd frontend
npm install
ng serve
```

The frontend will start on `http://localhost:4200`

### 4. Access the Application
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080/api
- H2 Console: http://localhost:8080/h2-console

## API Endpoints

### Users
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Groups
- `POST /api/groups` - Create group
- `GET /api/groups` - Get all groups
- `GET /api/groups/{id}` - Get group by ID
- `GET /api/groups/user/{userId}` - Get groups by user
- `PUT /api/groups/{id}` - Update group
- `DELETE /api/groups/{id}` - Delete group
- `POST /api/groups/{groupId}/members/{userId}` - Add member to group
- `DELETE /api/groups/{groupId}/members/{userId}` - Remove member from group

### Expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/{id}` - Get expense by ID
- `GET /api/expenses/group/{groupId}` - Get expenses by group
- `GET /api/expenses/user/{userId}` - Get expenses by user
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense
- `GET /api/expenses/user/{userId}/owed` - Get total owed by user
- `GET /api/expenses/user/{userId}/shares` - Get expense shares by user

## Database Schema

### Users
- id, username, email, password, firstName, lastName

### Groups
- id, name, description, createdBy, createdAt, updatedAt

### Group Members (Many-to-Many)
- group_id, user_id

### Expenses
- id, description, amount, paidBy, groupId, splitType, date, createdAt, updatedAt

### Expense Shares
- id, expenseId, userId, amount, percentage

## Split Types

1. **Equal Split**: Expense is divided equally among all group members
2. **Percentage Split**: Expense is split based on specified percentages
3. **Custom Split**: Expense is split according to custom amounts

## Development

### Backend Development
```bash
cd backend
mvn spring-boot:run
```

### Frontend Development
```bash
cd frontend
ng serve --open
```

### Running Tests
```bash
# Backend tests
cd backend
mvn test

# Frontend tests
cd frontend
ng test
```

### Building for Production
```bash
# Backend
cd backend
mvn clean package

# Frontend
cd frontend
ng build --configuration production
```

## Configuration

### Backend Configuration
Edit `backend/src/main/resources/application.properties`:
- Database connection settings
- JWT configuration
- Server port
- Logging levels

### Frontend Configuration
Edit `frontend/src/environments/environment.ts`:
- API URL
- Production settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
