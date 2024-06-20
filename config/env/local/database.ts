import env from "@strapi/utils/dist/env-helper";
import path from "path";

console.log('__dirname', path.join(__dirname, '..', '..', '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')));
module.exports = ({ env }) => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: path.join(__dirname, '..', '..', '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
    },
    useNullAsDefault: true,
  },
});
