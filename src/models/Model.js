const { query } = require('../config/queries');

/**
 * Base Model class that provides common CRUD operations
 * All models should extend this class
 */
class Model {
  /**
   * @param {string} tableName - The database table name
   */
  constructor(tableName) {
    this.tableName = tableName;
  }

  /**
   * Find all records
   * @param {Object} options - Query options (limit, offset, orderBy)
   * @returns {Promise<Array>} Array of records
   */
  async findAll(options = {}) {
    const { limit, offset, orderBy = 'id', order = 'ASC' } = options;

    let sql = `SELECT * FROM ${this.tableName} ORDER BY ${orderBy} ${order}`;

    if (limit) {
      sql += ` LIMIT ${limit}`;
      if (offset) {
        sql += ` OFFSET ${offset}`;
      }
    }

    return await query(sql);
  }

  /**
   * Find a record by ID
   * @param {number} id - Record ID
   * @returns {Promise<Object|null>} Record or null if not found
   */
  async findById(id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const results = await query(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Find records matching criteria
   * @param {Object} criteria - Key-value pairs to match
   * @returns {Promise<Array>} Array of matching records
   */
  async findBy(criteria) {
    const keys = Object.keys(criteria);
    const values = Object.values(criteria);

    if (keys.length === 0) {
      return await this.findAll();
    }

    const whereClause = keys.map(key => `${key} = ?`).join(' AND ');
    const sql = `SELECT * FROM ${this.tableName} WHERE ${whereClause}`;

    return await query(sql, values);
  }

  /**
   * Find one record matching criteria
   * @param {Object} criteria - Key-value pairs to match
   * @returns {Promise<Object|null>} Record or null if not found
   */
  async findOne(criteria) {
    const results = await this.findBy(criteria);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Create a new record
   * @param {Object} data - Record data
   * @returns {Promise<Object>} Created record with ID
   */
  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;

    const result = await query(sql, values);
    return await this.findById(result.insertId);
  }

  /**
   * Update a record by ID
   * @param {number} id - Record ID
   * @param {Object} data - Data to update
   * @returns {Promise<Object|null>} Updated record or null if not found
   */
  async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);

    if (keys.length === 0) {
      return await this.findById(id);
    }

    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;

    await query(sql, [...values, id]);
    return await this.findById(id);
  }

  /**
   * Delete a record by ID
   * @param {number} id - Record ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async delete(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Count total records
   * @param {Object} criteria - Optional criteria to filter count
   * @returns {Promise<number>} Total count
   */
  async count(criteria = {}) {
    const keys = Object.keys(criteria);
    const values = Object.values(criteria);

    let sql = `SELECT COUNT(*) as total FROM ${this.tableName}`;

    if (keys.length > 0) {
      const whereClause = keys.map(key => `${key} = ?`).join(' AND ');
      sql += ` WHERE ${whereClause}`;
    }

    const result = await query(sql, values);
    return result[0].total;
  }

  /**
   * Check if a record exists
   * @param {number} id - Record ID
   * @returns {Promise<boolean>} True if exists
   */
  async exists(id) {
    const record = await this.findById(id);
    return record !== null;
  }
}

module.exports = Model;
