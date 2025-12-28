require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const { pool } = require('../config/db');

const MIGRATIONS_DIR = path.join(__dirname, '../../database/migrations');

/**
 * Migration utility
 * Manages database schema changes through SQL migration files
 */

/**
 * Ensure migrations table exists
 */
async function ensureMigrationsTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_name (name)
    )
  `;
  await pool.query(sql);
}

/**
 * Get list of executed migrations
 */
async function getExecutedMigrations() {
  try {
    const [rows] = await pool.query('SELECT name FROM migrations ORDER BY name');
    return rows.map(row => row.name);
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return [];
    }
    throw error;
  }
}

/**
 * Get all migration files
 */
async function getMigrationFiles() {
  const files = await fs.readdir(MIGRATIONS_DIR);
  return files
    .filter(file => file.endsWith('.sql'))
    .sort();
}

/**
 * Execute a single migration
 */
async function executeMigration(filename) {
  const filepath = path.join(MIGRATIONS_DIR, filename);
  const sql = await fs.readFile(filepath, 'utf8');

  console.log(`Executing migration: ${filename}`);

  // Split by semicolon to handle multiple statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    await pool.query(statement);
  }

  // Record migration
  await pool.query('INSERT INTO migrations (name) VALUES (?)', [filename]);

  console.log(`✓ Completed: ${filename}`);
}

/**
 * Run all pending migrations
 */
async function runMigrations() {
  try {
    console.log('Starting migrations...\n');

    // Ensure migrations table exists
    await ensureMigrationsTable();

    // Get executed and available migrations
    const executed = await getExecutedMigrations();
    const available = await getMigrationFiles();

    // Find pending migrations
    const pending = available.filter(file => !executed.includes(file));

    if (pending.length === 0) {
      console.log('No pending migrations.');
      return;
    }

    console.log(`Found ${pending.length} pending migration(s):\n`);

    // Execute each pending migration
    for (const filename of pending) {
      await executeMigration(filename);
    }

    console.log('\n✓ All migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

/**
 * Show migration status
 */
async function showStatus() {
  try {
    await ensureMigrationsTable();

    const executed = await getExecutedMigrations();
    const available = await getMigrationFiles();
    const pending = available.filter(file => !executed.includes(file));

    console.log('Migration Status\n');
    console.log('Executed Migrations:');
    if (executed.length === 0) {
      console.log('  (none)');
    } else {
      executed.forEach(name => console.log(`  ✓ ${name}`));
    }

    console.log('\nPending Migrations:');
    if (pending.length === 0) {
      console.log('  (none)');
    } else {
      pending.forEach(name => console.log(`  ○ ${name}`));
    }

    console.log(`\nTotal: ${executed.length} executed, ${pending.length} pending`);
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

/**
 * Create a new migration file
 */
async function createMigration(name) {
  try {
    if (!name) {
      throw new Error('Migration name is required');
    }

    // Generate timestamp
    const timestamp = Date.now();
    const filename = `${timestamp}_${name}.sql`;
    const filepath = path.join(MIGRATIONS_DIR, filename);

    // Create migration template
    const template = `-- Migration: ${name}
-- Created: ${new Date().toISOString()}

-- Write your migration SQL here
-- Example:
-- CREATE TABLE example (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   name VARCHAR(255) NOT NULL
-- );
`;

    await fs.writeFile(filepath, template);
    console.log(`✓ Created migration: ${filename}`);
    console.log(`  Path: ${filepath}`);
  } catch (error) {
    console.error('Error creating migration:', error.message);
    throw error;
  }
}

// CLI interface
const command = process.argv[2];

switch (command) {
  case 'run':
    runMigrations();
    break;
  case 'status':
    showStatus();
    break;
  case 'create':
    const migrationName = process.argv[3];
    createMigration(migrationName);
    break;
  default:
    console.log(`
Database Migration Tool

Usage:
  node src/utils/migrate.js <command> [options]

Commands:
  run              Run all pending migrations
  status           Show migration status
  create <name>    Create a new migration file

Examples:
  node src/utils/migrate.js run
  node src/utils/migrate.js status
  node src/utils/migrate.js create add_user_avatar
    `);
    process.exit(1);
}
