const Project = require('../models/Project');

/**
 * Get all projects
 */
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get projects by user ID
 */
const getProjectsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const projects = await Project.findByUserId(userId);
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get project by ID
 */
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Create a new project
 */
const createProject = async (req, res) => {
  try {
    const { user_id, project_title, art_style, description } = req.body;
    const project = await Project.create({
      user_id,
      project_title,
      art_style,
      description
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    const statusCode = error.message.includes('required') ? 400 : 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
};

/**
 * Update project
 */
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { project_title, art_style, description } = req.body;

    const project = await Project.update(id, {
      project_title,
      art_style,
      description
    });

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Delete project
 */
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Project.delete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllProjects,
  getProjectsByUserId,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
