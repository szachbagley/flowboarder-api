const Model = require('./Model');

/**
 * Panel Model
 * Represents a storyboard panel with AI-generated image
 */
class Panel extends Model {
  constructor() {
    super('panels');
  }

  static get schema() {
    return {
      id: { type: 'number', required: false, autoIncrement: true },
      project_id: { type: 'number', required: true },
      setting_id: { type: 'number', required: false },
      image_link: { type: 'string', required: false, maxLength: 500 },
      shot_type: { type: 'string', required: false, maxLength: 100 },
      aspect_ratio: { type: 'string', required: false, maxLength: 50 },
      description: { type: 'text', required: false },
      reference_img: { type: 'string', required: false, maxLength: 500 },
      created_at: { type: 'timestamp', required: false, default: 'CURRENT_TIMESTAMP' },
      updated_at: { type: 'timestamp', required: false, default: 'CURRENT_TIMESTAMP' }
    };
  }

  validate(data, isUpdate = false) {
    const errors = [];
    if (!isUpdate && !data.project_id) {
      errors.push('project_id is required');
    }
    return { valid: errors.length === 0, errors };
  }

  async create(data) {
    const validation = this.validate(data);
    if (!validation.valid) throw new Error(validation.errors.join(', '));

    const sanitizedData = {
      project_id: data.project_id,
      setting_id: data.setting_id || null,
      image_link: data.image_link || null,
      shot_type: data.shot_type ? data.shot_type.trim() : null,
      aspect_ratio: data.aspect_ratio ? data.aspect_ratio.trim() : null,
      description: data.description ? data.description.trim() : null,
      reference_img: data.reference_img || null
    };

    return await super.create(sanitizedData);
  }

  async findByProjectId(projectId) {
    return await this.findBy({ project_id: projectId });
  }

  async getPanelWithCharacters(panelId) {
    const { query } = require('../config/queries');

    const panel = await this.findById(panelId);
    if (!panel) return null;

    const characters = await query(`
      SELECT cv.*, c.name as character_name
      FROM character_variants cv
      JOIN panel_characters pc ON cv.id = pc.character_variant_id
      JOIN characters c ON cv.character_id = c.id
      WHERE pc.panel_id = ?
    `, [panelId]);

    return { ...panel, characters };
  }
}

module.exports = new Panel();
