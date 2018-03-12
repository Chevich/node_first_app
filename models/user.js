'use strict';

const Joi = require('joi');
module.exports = {
	id: Joi.any().forbidden(),
	name: Joi.string().optional().required().max(100),
	email    : Joi.string().email().required().max(254), // Required
	// password : Joi.string().required().min(6).max(100),  // minimum length 6 characters]
};