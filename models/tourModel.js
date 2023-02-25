const mongoose = require('mongoose');
const validator = require('validator');
const SIMPLE_TOUR_ERR_MSG = 'A tour must have a';


const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, `${SIMPLE_TOUR_ERR_MSG} name`],
      unique: [true, 'Tour with this name is already exist'],
      trim: true,
      maxLength: [40, `A tour name mast have less or equal then 40 characters`],
      minLength: [4, `A tour name mast have more or equal then 4 characters`],
      validate: {
        validator: function(val) {
          return validator.isAlpha(val, 'en-US', { ignore: ' ' });
        },
        message: 'Name must contain only letters'
      }
    },
    price: {
      type: Number,
      required: [true, `${SIMPLE_TOUR_ERR_MSG} price`]
    },
    duration: {
      type: Number,
      required: [true, `${SIMPLE_TOUR_ERR_MSG} duration`]
    },
    maxGroupSize: {
      type: Number,
      required: [true, `${SIMPLE_TOUR_ERR_MSG} max group sized`]
    },
    difficulty: {
      type: String,
      required: [true, `${SIMPLE_TOUR_ERR_MSG} difficulty`],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be <easy>, <medium> or <difficult>'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [1, 'A rating must be more or equal than 1'],
      max: [5, 'A rating must be lower or equal than 5']
    },
    ratingQuantity: {
      type: Number,
      default: 0
    },
    discountPrice: {
      type: Number,
      validate: {
        validator: function(val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, `${SIMPLE_TOUR_ERR_MSG} summary`]
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, `${SIMPLE_TOUR_ERR_MSG} cover image`]
    },
    images: [String],
    createdAt: {
      type: Date,
      default: new Date(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      location: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.index({ ratingAverage: 1, price: -1 });
tourSchema.index({ slug: 1 });

tourSchema.virtual('durationWeek').get(function() {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

tourSchema.pre(/^find/, function(next) {
  this.populate('guides', '_id name role email');

  next();
});

/*tourSchema.pre('aggregate', function (next){
  console.log(this.pipeline())
  next()
})*/

/*
tourSchema.pre('save', async function(next) {
  console.log(this.guides)
  const guidesPromise = this.guides.map(id => User.findById(id));
  this.guides = await Promise.all(guidesPromise);
  next();
});
*/

module.exports = mongoose.model('Tour', tourSchema);

