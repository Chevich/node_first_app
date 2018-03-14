const pg = require('../../db/knex');

beforeEach(() => pg.migrate.rollback()
	.then(() => pg.migrate.latest())
	.then(() => pg.seed.run())
);

afterEach(() => pg.migrate.rollback());