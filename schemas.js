const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.placeSchema = Joi.object({
        place: Joi.object({
        title: Joi.string().required().escapeHTML(),
        // price: Joi.number().required().min(0),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        blogTitle: Joi.string().required().escapeHTML(),
        visitDate: Joi.string().required().escapeHTML(),
        publishDate: Joi.string().required().escapeHTML(),
        blogIntro: Joi.string().required().escapeHTML(),
        blogQuote: Joi.string().required().escapeHTML(),
        quoteAuthor: Joi.string().required().escapeHTML(),
        quoteSource: Joi.string().escapeHTML(),
        blogP1: Joi.string().required().escapeHTML(),
        blogP2: Joi.string().required().escapeHTML(),
        blogP3: Joi.string().escapeHTML(),
        blogP4: Joi.string().escapeHTML(),
        blogP5: Joi.string().escapeHTML(),
        blogP6: Joi.string().required().escapeHTML(),
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        // rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})