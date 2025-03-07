# Todo List with Django REST Framework

A simple Todo List API with authentication support.

## API Endpoints

### Tasks

- `GET /api/tasks/` - List all tasks
- `POST /api/tasks/` - Create a new task
- `GET /api/tasks/<id>/` - Get a specific task
- `PUT /api/tasks/<id>/` - Update a task
- `DELETE /api/tasks/<id>/` - Delete a task

### Authentication

- `GET /api/auth/login/` - Login page
- `GET /api/auth/logout/` - Logout
- `GET /admin/` - Admin interface

## Features

- Create, read, update, and delete tasks
- Optional user authentication
- Anonymous users can create tasks
- Logged-in users can manage their own tasks
