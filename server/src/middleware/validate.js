const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,   // collect all errors, not just the first
            stripUnknown: true   // drop fields not in the schema (blocks field injection)
        });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map((detail) => detail.message).join(", ")
            });
        }

        // Replace body with the validated/coerced value so defaults apply
        req.body = value;

        next();
    };
};

module.exports = validate;
