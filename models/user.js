'use strict';

const Joi = require('joi');
module.exports = {
	id: Joi.any().forbidden(),
	name: Joi.string().required().max(100),
	email: Joi.string().email().required().max(254),
};