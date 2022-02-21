const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const PlaceSchema = new Schema({
    title: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    // price: Number,
    description: String,
    visitDate: String,
    images: [ImageSchema],
    blogTitle: String,
    publishDate: String,
    blogIntro: String,
    blogQuote: String,
    quoteAuthor: String,
    quoteSource: String,
    blogP1: String,
    blogP2: String,
    blogP3: String,
    blogP4: String,
    blogP5: String,
    blogP6: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

PlaceSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/places/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});

PlaceSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Place', PlaceSchema);