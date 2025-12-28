# Flowboarder API

Backend API for Flowboarder built with Node.js and Express with MySQL database - fully containerized with Docker.

Flowboarder is an application that streamlines AI-powered storyboarding for filmmakers.
Users define characters, settings, objects, art styles, etc. and the application stores that context. Then, the user defines a shot to storyboard, without worrying about repeating all the context for the description. The app then gets an AI-generated image of the shot from an image generation model and returns it to the user, who can then use it in storyboarding with Flowboarder's additional tools.

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

### Users

**CRUD Operations**

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (requires email and name in body)
- `PUT /api/users/:id` - Update user (requires email and name in body)
- `DELETE /api/users/:id` - Delete user

**Additional Endpoints**

- `GET /api/users/search?q=term` - Search users by name or email
- `GET /api/users/stats` - Get user statistics (total, signups by period)
- `GET /api/users/recent?limit=10` - Get recent users (default 10)

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
│   ├── models/              # Data models
│   │   ├── Model.js         # Base model class
│   │   ├── User.js          # User model
│   │   └── index.js         # Models export
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

## Working with Models

The API uses a model-based architecture for data management. Models provide validation, business logic, and a clean interface for database operations.

### Using the User Model

```javascript
const User = require("./models/User");

// Create a user (with automatic validation)
const user = await User.create({
  email: "user@example.com",
  name: "John Doe",
});

// Find by ID
const user = await User.findById(1);

// Find by email
const user = await User.findByEmail("user@example.com");

// Search users
const users = await User.search("john");

// Update user
const updated = await User.update(1, { name: "Jane Doe" });

// Delete user
const deleted = await User.delete(1);

// Get statistics
const stats = await User.getStats();
```

### Creating Your Own Models

Extend the base `Model` class to create new models:

```javascript
const Model = require("./models/Model");

class Post extends Model {
  constructor() {
    super("posts"); // table name
  }

  // Define schema
  static get schema() {
    return {
      id: { type: "number", required: false, autoIncrement: true },
      title: { type: "string", required: true, maxLength: 255 },
      content: { type: "text", required: true },
    };
  }

  // Add custom validation
  validate(data, isUpdate = false) {
    const errors = [];
    if (data.title && data.title.length < 3) {
      errors.push("Title must be at least 3 characters");
    }
    return { valid: errors.length === 0, errors };
  }

  // Add custom methods
  async findByTitle(title) {
    return await this.findOne({ title });
  }
}

module.exports = new Post();
```

### Base Model Methods

All models automatically inherit these methods:

- `findAll(options)` - Get all records (supports limit, offset, orderBy)
- `findById(id)` - Find record by ID
- `findBy(criteria)` - Find records matching criteria
- `findOne(criteria)` - Find first record matching criteria
- `create(data)` - Create new record
- `update(id, data)` - Update record by ID
- `delete(id)` - Delete record by ID
- `count(criteria)` - Count records
- `exists(id)` - Check if record exists

### Model Features

- **Automatic validation** - Email format, required fields, length limits
- **Duplicate detection** - Prevents duplicate emails
- **Data sanitization** - Trims whitespace, normalizes email
- **Schema definition** - Clear data structure
- **Custom methods** - Add domain-specific operations
- **Error handling** - Descriptive validation errors

## Direct Database Queries

For complex queries not covered by models, use the query helper:

```javascript
const { query } = require("./config/queries");

// Raw SQL query
const users = await query("SELECT * FROM users WHERE created_at > ?", [date]);
```

## Database Migrations

Migrations manage your database schema changes in a version-controlled way. They allow you to evolve your database structure while keeping it in sync with your models.

### Migration Commands

```bash
# Run all pending migrations
npm run migrate

# Check migration status
npm run migrate:status

# Create a new blank migration
npm run migrate:create add_avatar_to_users

# Generate migration from a model
npm run migrate:generate User
```

### How It Works

1. **Migration files** are stored in `database/migrations/`
2. Each file is timestamped and run in order
3. A `migrations` table tracks which migrations have been executed
4. Migrations are only run once

### Creating Migrations

#### Option 1: Generate from Model

The easiest way is to generate a migration from your model schema:

```bash
npm run migrate:generate User
```

This creates a migration file based on your User model's schema definition.

#### Option 2: Create Manually

Create a blank migration and write SQL:

```bash
npm run migrate:create add_posts_table
```

Then edit the generated file in `database/migrations/`:

```sql
-- Migration: add_posts_table
-- Created: 2024-01-28T12:00:00.000Z

CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);
```

### Running Migrations

Run pending migrations:

```bash
npm run migrate
```

Output:
```
Starting migrations...

Found 2 pending migration(s):

Executing migration: 20241228000001_create_users_table.sql
✓ Completed: 20241228000001_create_users_table.sql

Executing migration: 20241228000002_add_posts_table.sql
✓ Completed: 20241228000002_add_posts_table.sql

✓ All migrations completed successfully!
```

### Check Migration Status

See which migrations have been applied:

```bash
npm run migrate:status
```

Output:
```
Migration Status

Executed Migrations:
  ✓ 00000000000000_create_migrations_table.sql
  ✓ 20241228000001_create_users_table.sql

Pending Migrations:
  ○ 20241228000002_add_posts_table.sql

Total: 2 executed, 1 pending
```

### Migration Workflow

1. **Create your model** with schema definition
2. **Generate migration** from the model
3. **Review** the generated SQL
4. **Run migration** to apply changes
5. **Commit** both model and migration files

Example workflow:

```bash
# 1. Create a new model (Post.js with schema)
# 2. Generate migration
npm run migrate:generate Post

# 3. Review the generated SQL in database/migrations/

# 4. Run migration
npm run migrate

# 5. Verify
npm run migrate:status
```

### Best Practices

- **Never modify executed migrations** - Create a new migration instead
- **Test migrations locally** before deploying
- **Keep migrations small** - One logical change per migration
- **Use transactions** for complex migrations
- **Document changes** - Add comments to explain the "why"
- **Version control** - Commit migrations with your code

### Example: Adding a Field

If you need to add a field to an existing table:

```bash
# Create migration
npm run migrate:create add_avatar_to_users
```

Edit the migration file:

```sql
-- Add avatar field to users table

ALTER TABLE users
ADD COLUMN avatar VARCHAR(255) NULL AFTER name;
```

Run the migration:

```bash
npm run migrate
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
