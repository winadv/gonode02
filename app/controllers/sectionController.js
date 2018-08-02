const { Section, Project, User } = require('../models');

module.exports = {
  async store(req, res, next) {
    try {
      const { projectId } = req.params;
      const section = await Section.create({
        ...req.body,
        ProjectId: projectId,
      });
      req.flash('success', 'Snippet criado com sucesso');
      return res.redirect(`/app/projects/${projectId}/sections/${section.id}`);
    } catch (err) {
      return next(err);
    }
  },
  async show(req, res, next) {
    try {
      const user = await User.findById(req.session.user.id);
      const { projectId, id } = req.params;
      const projects = await Project.findAll({
        include: [Section],
        where: {
          UserId: req.session.user.id,
        },
      });
      const proj = await Project.findById(projectId);
      const sections = await Section.findAll({
        where: {
          ProjectId: projectId,

        },
      });
      const section = await Section.findById(id);
      res.render('sections/show', {
        activeProject: projectId,
        projects,
        user,
        sections,
        currentSection: section,
        proj,
      });
    } catch (err) {
      return next(err);
    }
  },
  async update(req, res, next) {
    try {
      const section = await Section.findById(req.params.id);
      await section.update(req.body);
      req.flash('success', 'Seção atualizado com sucesso');
      return res.redirect(`/app/projects/${req.params.projectId}/sections/${section.id}`);
    } catch (err) {
      return next(err);
    }
  },
  async destroy(req, res, next) {
    try {
      await Section.destroy({ where: { id: req.params.id } });
      req.flash('success', 'Snippet deletado com sucesso');
      return res.redirect(`/app/projects/${req.params.projectId}`);
    } catch (err) {
      return next(err);
    }
  },
};
