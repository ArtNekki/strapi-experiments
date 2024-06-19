'use strict';
// import { request } from "@octokit/request";
 const { request } = require("@octokit/request");

module.exports = ({ strapi }) => ({
   getPublicRepos: async () => {
    const result = await request("GET /user/repos", {
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
      type: "public",
    });

    return result;
  },
});
