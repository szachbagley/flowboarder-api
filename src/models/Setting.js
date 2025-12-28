const Model = require('./Model');

/**
 * Setting Model
 * Represents a setting/environment in a storyboarding project
 */
class Setting extends Model {
  constructor() {
    super('settings');
  }

  static get schema() {
    return {
      id: { type: 'number', required: false, autoIncrement: true },
      project_id: { type: 'number', required: true },
      name: { type: 'string', required: true, maxLength: 255 },
      description: { type: 'text', required: false },
      reference_img: { type: 'string', required: false, maxLength: 500 },
      created_at: { type: 'timestamp', required: false, default: 'CURRENT_TIMESTAMP' },
      updated_at: { type: 'timestamp', required: false, default: 'CURRENT_TIMESTAMP' }
    };
  }

  validate(data, isUpdate = false) {
    const errors = [];
    if (!isUpdate) {
      if (!data.project_id) errors.push('project_id is required');
      if (!data.name) errors.push('name is required');
    }
    if (data.name && data.name.trim().length === 0) {
      errors.push('name must be a non-empty string');
    }
    return { valid: errors.length === 0, errors };
  }

  async create(data) {
    const validation = this.validate(data);
    if (!validation.valid) throw new Error(validation.errors.join(', '));

    const sanitizedData = {
      project_id: data.project_id,
      name: data.name.trim(),
      description: data.description ? data.description.trim() : null,
      reference_img: data.reference_img || null
    };

    return await super.create(sanitizedData);
  }

  async findByProjectId(projectId) {
    return await this.findBy({ project_id: projectId });
  }
}

module.exports = new Setting();
