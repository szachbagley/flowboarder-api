const Model = require('./Model');

/**
 * Project Model
 */
class Project extends Model {
  constructor() {
    super('projects');
  }

  static get schema() {
    return {
      id: { type: 'number', required: false, autoIncrement: true },
      user_id: { type: 'number', required: true },
      project_title: { type: 'string', required: true, maxLength: 255 },
      art_style: { type: 'string', required: false, maxLength: 255 },
      description: { type: 'text', required: false },
      created_at: { type: 'timestamp', required: false, default: 'CURRENT_TIMESTAMP' },
      updated_at: { type: 'timestamp', required: false, default: 'CURRENT_TIMESTAMP' }
    };
  }

  validate(data, isUpdate = false) {
    const errors = [];
    if (!isUpdate) {
      if (!data.user_id) errors.push('user_id is required');
      if (!data.project_title) errors.push('project_title is required');
    }
    if (data.project_title && data.project_title.trim().length === 0) {
      errors.push('project_title must be a non-empty string');
    }
    return { valid: errors.length === 0, errors };
  }

  async create(data) {
    const validation = this.validate(data);
    if (!validation.valid) throw new Error(validation.errors.join(', '));

    const sanitizedData = {
      user_id: data.user_id,
      project_title: data.project_title.trim(),
      art_style: data.art_style ? data.art_style.trim() : null,
      description: data.description ? data.description.trim() : null
    };

    return await super.create(sanitizedData);
  }

  async findByUserId(userId) {
    return await this.findBy({ user_id: userId });
  }
}

module.exports = new Project();
