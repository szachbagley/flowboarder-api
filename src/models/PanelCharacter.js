const Model = require('./Model');

/**
 * PanelCharacter Model
 * Junction table linking panels to character variants (many-to-many relationship)
 */
class PanelCharacter extends Model {
  constructor() {
    super('panel_characters');
  }

  static get schema() {
    return {
      panel_id: { type: 'number', required: true },
      character_variant_id: { type: 'number', required: true }
    };
  }

  validate(data) {
    const errors = [];
    if (!data.panel_id) errors.push('panel_id is required');
    if (!data.character_variant_id) errors.push('character_variant_id is required');
    return { valid: errors.length === 0, errors };
  }

  async create(data) {
    const validation = this.validate(data);
    if (!validation.valid) throw new Error(validation.errors.join(', '));

    // Check if relationship already exists
    const { query } = require('../config/queries');
    const existing = await query(
      'SELECT * FROM panel_characters WHERE panel_id = ? AND character_variant_id = ?',
      [data.panel_id, data.character_variant_id]
    );

    if (existing.length > 0) {
      throw new Error('This character variant is already in this panel');
    }

    return await super.create(data);
  }

  async findByPanelId(panelId) {
    return await this.findBy({ panel_id: panelId });
  }

  async findByCharacterVariantId(characterVariantId) {
    return await this.findBy({ character_variant_id: characterVariantId });
  }

  async removeCharacterFromPanel(panelId, characterVariantId) {
    const { query } = require('../config/queries');
    const result = await query(
      'DELETE FROM panel_characters WHERE panel_id = ? AND character_variant_id = ?',
      [panelId, characterVariantId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = new PanelCharacter();
