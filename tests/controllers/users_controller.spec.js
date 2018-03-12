'use strict';

const userController = require('../../controllers/users_controller');
const expect = require('chai').expect;

describe('Users controller', () => {
	describe('"configure"', () => {
		it('should export a function', () => {
			expect(userController.configure).to.be.a('function')
		})
	})
});