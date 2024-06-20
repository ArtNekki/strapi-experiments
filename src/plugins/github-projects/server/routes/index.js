module.exports = [
  {
    method: 'GET',
    path: '/repos',
    handler: 'getReposController.index',
    config: {
      policies: ["admin::isAuthenticatedAdmin"],
      // auth: false
    },
  },
];
