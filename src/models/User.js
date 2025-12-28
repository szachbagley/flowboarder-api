const Model = require('./Model');

/**
 * User Model
 * Handles all user-related database operations
 */
class User extends Model {
  constructor() {
    super('users');
  }

  /**
   * Define user schema/fields
   */
  static get schema() {
    return {
      id: { type: 'number', required: false, autoIncrement: true },
      email: { type: 'string', required: true, unique: true, maxLength: 255 },
      name: { type: 'string', required: true, maxLength: 255 },
      created_at: { type: 'timestamp', required: false, default: 'CURRENT_TIMESTAMP' },
      updated_at: { type: 'timestamp', required: false, default: 'CURRENT_TIMESTAMP' }
    };
  }

  /**
   * Validate user data
   * @param {Object} data - User data to validate
   * @param {boolean} isUpdate - Whether this is an update operation
   * @returns {Object} Validation result { valid: boolean, errors: Array }
   */
  validate(data, isUpdate = false) {
    const errors = [];
    const schema = User.schema;

    // Check required fields (skip for updates)
    if (!isUpdate) {
      Object.keys(schema).forEach(field => {
        if (schema[field].required && !data[field]) {
          errors.push(`${field} is required`);
        }
      });
    }

    // Validate email format
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.push('Invalid email format');
      }
      if (data.email.length > schema.email.maxLength) {
        errors.push(`Email must be less than ${schema.email.maxLength} characters`);
      }
    }

    // Validate name
    if (data.name) {
      if (typeof data.name !== 'string' || data.name.trim().length === 0) {
        errors.push('Name must be a non-empty string');
      }
      if (data.name.length > schema.name.maxLength) {
        errors.push(`Name must be less than ${schema.name.maxLength} characters`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Create a new user with validation
   * @param {Object} data - User data
   * @returns {Promise<Object>} Created user
   */
  async create(data) {
    const validation = this.validate(data);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    // Check if email already exists
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new Error('Email already exists');
    }

    // Sanitize data (only allow known fields)
    const sanitizedData = {
      email: data.email.trim().toLowerCase(),
      name: data.name.trim()
    };

    return await super.create(sanitizedData);
  }

  /**
   * Update a user with validation
   * @param {number} id - User ID
   * @param {Object} data - User data to update
   * @returns {Promise<Object|null>} Updated user
   */
  async update(id, data) {
    const validation = this.validate(data, true);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    // Check if email is being changed and if it already exists
    if (data.email) {
      const existing = await this.findByEmail(data.email);
      if (existing && existing.id !== id) {
        throw new Error('Email already exists');
      }
    }

    // Sanitize data
    const sanitizedData = {};
    if (data.email) sanitizedData.email = data.email.trim().toLowerCase();
    if (data.name) sanitizedData.name = data.name.trim();

    return await super.update(id, sanitizedData);
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User or null
   */
  async findByEmail(email) {
    return await this.findOne({ email: email.toLowerCase() });
  }

  /**
   * Search users by name or email
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Matching users
   */
  async search(searchTerm) {
    const { query } = require('../config/queries');
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE name LIKE ? OR email LIKE ?
      ORDER BY name ASC
    `;
    const term = `%${searchTerm}%`;
    return await query(sql, [term, term]);
  }

  /**
   * Get user statistics
   * @returns {Promise<Object>} User stats
   */
  async getStats() {
    const { query } = require('../config/queries');
    const sql = `
      SELECT
        COUNT(*) as total_users,
        COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as today_signups,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as week_signups,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as month_signups
      FROM ${this.tableName}
    `;
    const result = await query(sql);
    return result[0];
  }

  /**
   * Get recent users
   * @param {number} limit - Number of users to return
   * @returns {Promise<Array>} Recent users
   */
  async getRecent(limit = 10) {
    return await this.findAll({
      limit,
      orderBy: 'created_at',
      order: 'DESC'
    });
  }
}

// Export a singleton instance
module.exports = new User();
