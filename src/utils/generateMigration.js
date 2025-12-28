const fs = require('fs').promises;
const path = require('path');

/**
 * Generate SQL CREATE TABLE statement from model schema
 */
function generateCreateTableSQL(tableName, schema) {
  const fields = [];
  const indexes = [];

  Object.entries(schema).forEach(([fieldName, config]) => {
    if (fieldName === 'id' && config.autoIncrement) {
      fields.push('  id INT AUTO_INCREMENT PRIMARY KEY');
      return;
    }

    let fieldDef = `  ${fieldName}`;

    // Map type to SQL type
    switch (config.type) {
      case 'string':
        fieldDef += ` VARCHAR(${config.maxLength || 255})`;
        break;
      case 'text':
        fieldDef += ' TEXT';
        break;
      case 'number':
      case 'integer':
        fieldDef += ' INT';
        break;
      case 'float':
      case 'decimal':
        fieldDef += ' DECIMAL(10,2)';
        break;
      case 'boolean':
        fieldDef += ' BOOLEAN';
        break;
      case 'date':
        fieldDef += ' DATE';
        break;
      case 'datetime':
      case 'timestamp':
        fieldDef += ' TIMESTAMP';
        break;
      default:
        fieldDef += ' VARCHAR(255)';
    }

    // Add NOT NULL if required
    if (config.required) {
      fieldDef += ' NOT NULL';
    }

    // Add UNIQUE constraint
    if (config.unique) {
      fieldDef += ' UNIQUE';
    }

    // Add DEFAULT value
    if (config.default) {
      if (config.default === 'CURRENT_TIMESTAMP') {
        fieldDef += ' DEFAULT CURRENT_TIMESTAMP';
      } else if (typeof config.default === 'string') {
        fieldDef += ` DEFAULT '${config.default}'`;
      } else {
        fieldDef += ` DEFAULT ${config.default}`;
      }
    }

    // Add ON UPDATE for timestamp
    if (config.type === 'timestamp' && fieldName === 'updated_at') {
      fieldDef += ' ON UPDATE CURRENT_TIMESTAMP';
    }

    fields.push(fieldDef);

    // Create index for unique and commonly searched fields
    if (config.unique || config.index) {
      indexes.push(`  INDEX idx_${fieldName} (${fieldName})`);
    }
  });

  // Combine fields and indexes
  const allDefinitions = [...fields, ...indexes].join(',\n');

  return `CREATE TABLE IF NOT EXISTS ${tableName} (
${allDefinitions}
);`;
}

/**
 * Generate migration from model
 */
async function generateMigrationFromModel(modelPath, migrationName) {
  try {
    // Import the model
    const Model = require(modelPath);
    const modelName = path.basename(modelPath, '.js');

    // Get schema
    if (!Model.constructor.schema) {
      throw new Error(`Model ${modelName} does not have a schema defined`);
    }

    const schema = Model.constructor.schema;
    const tableName = Model.tableName;

    // Generate SQL
    const sql = generateCreateTableSQL(tableName, schema);

    // Create migration file
    const timestamp = Date.now();
    const filename = `${timestamp}_${migrationName || `create_${tableName}_table`}.sql`;
    const filepath = path.join(__dirname, '../../database/migrations', filename);

    const content = `-- Migration: ${migrationName || `Create ${tableName} table`}
-- Generated from: ${modelName} model
-- Created: ${new Date().toISOString()}

${sql}
`;

    await fs.writeFile(filepath, content);

    console.log(`✓ Generated migration: ${filename}`);
    console.log(`  Table: ${tableName}`);
    console.log(`  Path: ${filepath}`);
    console.log('\nSQL Preview:');
    console.log(sql);

    return filepath;
  } catch (error) {
    console.error('Error generating migration:', error.message);
    throw error;
  }
}

/**
 * CLI interface
 */
if (require.main === module) {
  const modelName = process.argv[2];
  const migrationName = process.argv[3];

  if (!modelName) {
    console.log(`
Generate Migration from Model

Usage:
  node src/utils/generateMigration.js <ModelName> [migration-name]

Examples:
  node src/utils/generateMigration.js User
  node src/utils/generateMigration.js Post create_posts_table

Available Models:
  User
    `);
    process.exit(1);
  }

  const modelPath = path.join(__dirname, `../models/${modelName}.js`);
  generateMigrationFromModel(modelPath, migrationName);
}

module.exports = { generateCreateTableSQL, generateMigrationFromModel };
