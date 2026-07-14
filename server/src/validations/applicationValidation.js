const Joi = require ("joi");

//create application validation
const createApplicationSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .required(),

    description: Joi.string()
        .required(),

    version: Joi.string()
        .required()

});

//update application
const updateApplicationSchema = Joi.object({
    name: Joi.string()
        .min(2),
    
     description: Joi.string(),

     version: Joi.string()
}).min(1);

module.exports={
    createApplicationSchema,
    updateApplicationSchema
};