const Joi = require('joi');
Joi.objectId = require("joi-objectid")(Joi);
const validationSchema = {
	addTudo: {
		title: Joi.string().required(),
		description: Joi.string().required(),
		published: Joi.boolean().required()

	},
	updateTudo: {
		title: Joi.string().required(),
		description: Joi.string().required(),
		published: Joi.boolean().required()

	},
	idValidation: {
		id: Joi.number().required(),
	}

};


module.exports = validationSchema;
