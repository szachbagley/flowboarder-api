const fs = require('fs');
const path = require('path');

// Helper function to map types
function mapType(config) {
  switch (config.type) {
    case 'string':
      return `VARCHAR(${config.maxLength || 255})`;
    case 'text':
      return 'TEXT';
    case 'number':
    case 'integer':
      return 'INT';
    case 'boolean':
      return 'BOOLEAN';
    case 'timestamp':
      return 'TIMESTAMP';
    default:
      return 'VARCHAR(255)';
  }
}

// Models to generate migrations for
const models = [
  { name: 'Project', table: 'projects', order: 2 },
  { name: 'Character', table: 'characters', order: 3 },
  { name: 'CharacterVariant', table: 'character_variants', order: 4 },
  { name: 'Setting', table: 'settings', order: 5 },
  { name: 'Panel', table: 'panels', order: 6 },
  { name: 'PanelCharacter', table: 'panel_characters', order: 7 }
];

console.log('Generating migrations...\n');

models.forEach(({ name, table, order }) => {
  const Model = require(`../src/models/${name}.js`);
  const schema = Model.constructor.schema;

  let sql = `CREATE TABLE IF NOT EXISTS ${table} (\n`;
  const fields = [];
  const indexes = [];

  Object.entries(schema).forEach(([fieldName, config]) => {
    let field = `  ${fieldName} ${mapType(config)}`;

    if (config.autoIncrement) {
      field += ' AUTO_INCREMENT PRIMARY KEY';
    } else {
      if (config.required) field += ' NOT NULL';
      if (config.unique) field += ' UNIQUE';
      if (config.default === 'CURRENT_TIMESTAMP') {
        field += ' DEFAULT CURRENT_TIMESTAMP';
      }
      if (fieldName === 'updated_at' && config.type === 'timestamp') {
        field += ' ON UPDATE CURRENT_TIMESTAMP';
      }
    }

    fields.push(field);

    if (config.unique || fieldName.endsWith('_id')) {
      indexes.push(`  INDEX idx_${fieldName} (${fieldName})`);
    }
  });

  // Add composite primary key for junction table
  if (table === 'panel_characters') {
    fields.push('  PRIMARY KEY (panel_id, character_variant_id)');
  }

  sql += fields.join(',\n');
  if (indexes.length > 0 && table !== 'panel_characters') {
    sql += ',\n' + indexes.join(',\n');
  }
  sql += '\n);';

  const timestamp = `2024122800000${order}`;
  const filename = `${timestamp}_create_${table}_table.sql`;
  const content = `-- Migration: Create ${table} table
-- Generated from ${name} model

${sql}
`;

  const filepath = path.join(__dirname, '../database/migrations', filename);
  fs.writeFileSync(filepath, content);
  console.log(`✓ Created migration: ${filename}`);
});

console.log('\n✓ All migrations generated successfully!');
