'use strict';

const userController = require('../../controllers/users_controller');
const expect = require('chai').expect;

describe('Users controller', () => {
	describe('"configure"', () => {
		it('should export a CONFIGURE function', () => {
			expect(userController.configure).to.be.a('function')
		})
	});

	describe('"routes"', () => {
		it('should export routes', () => {
			expect(userController.routes).to.be.a('function');

		});

		userController.routes().forEach(route => {
			it(`should have published route ${route.method} ${route.path}`, () => {
				expect(route).to.have.property('config');

				expect(route.config).to.have.property('description');
				expect(route.config.description).to.not.be.empty;

				expect(route.config).to.have.property('notes');
				expect(route.config.notes).to.not.be.empty;

				expect(route.config).to.have.property('auth');
				expect(route.config.auth).to.not.be.empty;

				expect(route.config).to.have.property('tags');
				expect(route.config.tags).to.not.eq(['api']);

				expect(route.config).to.have.property('validate');
				expect(route.config.validate).to.have.property('headers');
			});
		});

	})
});