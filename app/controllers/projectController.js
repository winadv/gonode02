const { Project, Section, User } = require('../models');

module.exports = {
  async store(req, res, next) {
    try {
      const project = await Project.create({
        ...req.body,
        UserId: req.session.user.id,
      });
      req.flash('success', 'Projeto criado com sucesso');
      return res.redirect(`/app/projects/${project.id}`);
    } catch (err) {
      return next(err);
    }
  },
  async show(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findById(req.session.user.id);
      const projects = await Project.findAll({
        include: [Section],
        where: {
          UserId: req.session.user.id,
        },
      });
      const proj = await Project.findById(id);
      const sections = await Section.findAll({
        where: { ProjectId: req.params.id },
      });
      const section = await Section.findById(id);
      return res.render('projects/show', {
        projects,
        proj,
        user,
        sections,
        currentSection: section,
        activeProject: req.params.id,
      });
    } catch (err) {
      return next(err);
    }
  },
  async destroy(req, res, next) {
    try {
      await Project.destroy({ where: { id: req.params.id } });
      req.flash('success', 'Projeto deletado com sucesso');
      return res.redirect('/app/dashboard');
    } catch (err) {
      return next(err);
    }
  },
};
