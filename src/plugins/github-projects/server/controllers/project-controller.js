'use strict';

module.exports = ({strapi}) => ({
  create: async (ctx) => {
    const repo = ctx.request.body;

    const newProject = await strapi.plugin('github-projects')
      .service('projectService').create(repo, ctx.state.user.id);

    // const sanitizedProducts = await this.sanitizeOutput(newProject, ctx);
    // console.log('sanitizedProducts', sanitizedProducts);
    // return this.transformResponse(sanitizedProducts);

    return newProject;
  },

  delete: async (ctx) => {
    const {id} = ctx.params;

    const deletedProject = await strapi.plugin('github-projects')
      .service('projectService').delete(id);

    return deletedProject;
  }
})
