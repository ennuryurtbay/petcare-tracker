# petcare-tracker
Pet Care Tracking System for System Analysis course
# Pet Care Tracker

Pet Care Tracker is a web-based CRUD application developed for the System Analysis and Design course.

## Features

- Add new pets
- View all pets
- Update pet information
- Delete pets
- RESTful API support
- SQLite database integration
- Swagger API documentation

## Technologies Used

- Node.js
- Express.js
- SQLite
- Swagger UI

## Installation

1. Clone the repository

```bash
git clone <repository-link>
```

2. Install dependencies

```bash
npm install
```

3. Start the server

```bash
node server.js
```

## API Endpoints

### Get all pets

```http
GET /pets
```

### Add new pet

```http
POST /pets
```

### Update pet

```http
PUT /pets/:id
```

### Delete pet

```http
DELETE /pets/:id
```

## Swagger Documentation

```text
http://localhost:3000/api-docs
```

## Project Purpose

This project was created to practice REST API development, CRUD operations, database integration, and backend architecture principles.
## Additional Features
- Search pets by name
- Dashboard statistics for total, completed and pending records
- Vaccine due soon warning system
- Overdue vaccine alert system
- Dark mode support
- Dynamic frontend updates without full page refresh

## How to Run
After starting the server, open:

http://localhost:3000

Swagger API documentation:

http://localhost:3000/api-docs
