'use strict';

module.exports = ({strapi}) => ({
  create: async (repo, userId) => {
    const newProject =
      await strapi.entityService.create("plugin::github-projects.project", {
        data: {
          repositoryId: `${repo.id}`,
          title: repo.name,
          shortDescription: repo.shortDescription,
          repositoryUrl: repo.url,
          longDescription: repo.longDescription,
          createdBy: userId,
          updatedBy: userId
        }
      })

    return newProject;
  },

  createAll: async ({repos}, userId) => {
    const createdProjects = repos.map(
      async (repo) =>
        await strapi
          .plugin("github-projects")
          .service("projectService")
          .create(repo, userId));

    return Promise.all(createdProjects);
  },

  delete: async (id) => {
    return await strapi.entityService.delete("plugin::github-projects.project", id);
  }
})
