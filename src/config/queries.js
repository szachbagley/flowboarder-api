const { pool } = require('./db');

/**
 * Execute a query with parameters
 * @param {string} sql - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
const query = async (sql, params = []) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

/**
 * Execute a raw query (for complex queries)
 * @param {string} sql - SQL query string
 * @returns {Promise} Query result
 */
const rawQuery = async (sql) => {
  try {
    const [rows] = await pool.query(sql);
    return rows;
  } catch (error) {
    console.error('Raw query error:', error);
    throw error;
  }
};

module.exports = {
  query,
  rawQuery
};
