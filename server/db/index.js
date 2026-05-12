const Datastore = require('nedb-promises');

module.exports = {
  users:    Datastore.create({ filename: './server/db/users.db',    autoload: true }),
  logs:     Datastore.create({ filename: './server/db/logs.db',     autoload: true }),
  projects: Datastore.create({ filename: './server/db/projects.db', autoload: true }),
  signals:  Datastore.create({ filename: './server/db/signals.db',  autoload: true }),
};