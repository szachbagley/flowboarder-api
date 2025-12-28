# Flowboarder API

Backend API for Flowboarder built with Node.js and Express with MySQL database - fully containerized with Docker.

## Quick Start (Full Docker Stack)

```bash
# Start everything (API + MySQL) in Docker
npm run docker:up

# View logs
npm run docker:logs
```

The API will be available at `http://localhost:3000`

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (v20 or higher) - only needed for local development

## Deployment Options

### Option 1: Full Docker Stack (Recommended)

Run both the API and MySQL in Docker containers. This is closest to production.

```bash
# Start all services in production mode
npm run docker:up

# View logs
npm run docker:logs

# Stop all services
npm run docker:down
```

**What this does:**
- Builds the API Docker image from `Dockerfile`
- Starts MySQL container
- Starts API container
- Automatically connects API to MySQL
- Both services run in background

### Option 2: Development Mode (Docker MySQL + Local API)

Run MySQL in Docker but develop the API locally with hot reload.

```bash
# Terminal 1: Start just the MySQL container
npm run docker:db

# Terminal 2: Install dependencies and run API locally
npm install
npm run dev
```

**Note:** Make sure `DB_HOST=localhost` in your `.env` file for this mode.

### Option 3: Full Development Stack (Docker with Hot Reload)

Run both API and MySQL in Docker with code hot reloading.

```bash
# Start in development mode with hot reload
npm run docker:dev
```

This uses `docker-compose.dev.yml` and mounts your local code for live reloading.

## Docker Commands Reference

### Basic Commands
- `npm run docker:up` - Start all services (API + MySQL) in background
- `npm run docker:down` - Stop all services
- `npm run docker:build` - Rebuild Docker images
- `npm run docker:restart` - Restart all services
- `npm run docker:clean` - Remove all containers and data (destructive!)

### Development Commands
- `npm run docker:dev` - Start in development mode with hot reload
- `npm run docker:db` - Start only MySQL container

### Logging Commands
- `npm run docker:logs` - View logs from all services
- `npm run docker:logs:api` - View only API logs
- `npm run docker:logs:db` - View only MySQL logs

### Local Development Commands
- `npm run dev` - Run API locally (requires MySQL in Docker)
- `npm start` - Run API locally in production mode

## API Endpoints

### General
- `GET /health` - Health check endpoint
- `GET /api` - Welcome message

### Users (Example CRUD)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (requires email and name in body)
- `PUT /api/users/:id` - Update user (requires email and name in body)
- `DELETE /api/users/:id` - Delete user

## Project Structure

```
flowboarder-api/
├── database/
│   ├── init/
│   │   └── 01-init.sql      # Docker initialization script
│   └── setup.sql            # Manual setup script (legacy)
├── src/
│   ├── app.js               # Express app configuration
│   ├── server.js            # Server entry point
│   ├── routes/              # Route definitions
│   │   ├── index.js
│   │   └── users.js
│   ├── controllers/         # Request handlers
│   │   └── userController.js
│   ├── middleware/          # Custom middleware
│   └── config/
│       ├── database.js      # Database configuration
│       ├── db.js            # Database connection pool
│       └── queries.js       # Query helper functions
├── .env                     # Environment variables
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore file
├── .dockerignore           # Docker ignore file
├── Dockerfile              # Production Docker image
├── Dockerfile.dev          # Development Docker image
├── docker-compose.yml      # Production Docker Compose
├── docker-compose.dev.yml  # Development Docker Compose
└── package.json            # Project dependencies
```

## Environment Variables

The `.env` file is already configured. Key variables:

```bash
PORT=3000
NODE_ENV=development

# Database Configuration
# Use 'localhost' when running API locally (npm run dev)
# Docker Compose will override to 'mysql' when running in containers
DB_HOST=localhost
DB_USER=flowboarder
DB_PASSWORD=password
DB_NAME=flowboarder_db
DB_PORT=3306

# MySQL Root Password (for Docker container)
DB_ROOT_PASSWORD=rootpassword
```

**Important Notes:**
- `DB_HOST` should be `localhost` in `.env` for local development
- Docker Compose automatically overrides `DB_HOST=mysql` when running the API in a container
- Change passwords for production deployments

## Using the Database

The database connection is available through the query helper:

```javascript
const { query } = require('./config/queries');

// Example: Get all users
const users = await query('SELECT * FROM users');

// Example: Insert a user
const result = await query(
  'INSERT INTO users (email, name) VALUES (?, ?)',
  ['user@example.com', 'John Doe']
);
```

## Testing the API

Once running, test the endpoints:

```bash
# Health check
curl http://localhost:3000/health

# Get all users (includes 2 sample users)
curl http://localhost:3000/api/users

# Get user by ID
curl http://localhost:3000/api/users/1

# Create a new user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"new@example.com","name":"New User"}'

# Update user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"email":"updated@example.com","name":"Updated User"}'

# Delete user
curl -X DELETE http://localhost:3000/api/users/1
```

## Docker Architecture

### Production Stack (`docker-compose.yml`)
- **API Container**: Node.js 20 Alpine, production dependencies only
- **MySQL Container**: MySQL 8.1, persistent volume storage
- **Network**: Bridge network for container communication
- **Health Checks**: Both containers monitored for health
- **Dependencies**: API waits for MySQL to be healthy before starting

### Development Stack (`docker-compose.dev.yml`)
- **API Container**: Includes nodemon for hot reload
- **Volume Mounting**: Local code mounted into container
- **Live Updates**: Changes to code automatically restart the server

### Key Features
- **Automatic initialization**: Database schema created on first run
- **Persistent data**: MySQL data survives container restarts
- **Health monitoring**: Containers automatically restart on failure
- **Network isolation**: Containers communicate via private network
- **Port exposure**: API on 3000, MySQL on 3306

## Troubleshooting

### Database connection fails
```bash
# Check if MySQL is ready
npm run docker:logs:db

# Look for "ready for connections"
# If not ready, wait 10-20 seconds after starting
```

### API won't start
```bash
# View API logs
npm run docker:logs:api

# Rebuild containers
npm run docker:build
npm run docker:up
```

### Reset everything
```bash
# Remove all containers and data
npm run docker:clean

# Start fresh
npm run docker:up
```

### Port already in use
```bash
# Change port in .env file
PORT=3001

# Or stop conflicting service
lsof -ti:3000 | xargs kill
```
