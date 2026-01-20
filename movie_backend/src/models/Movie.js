import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  releaseYear: {
    type: Number,
    required: true,
    min: 1800,
    max: new Date().getFullYear()
  },
  endYear: {
    type: Number,
    min: 1800,
    max: new Date().getFullYear() + 50
  },
  genre: {
    type: [String],
    required: true
  },
  director: {
    type: String,
    required: function() {
      return this.type === 'movie';
    },
    trim: true
  },
  creator: {
    type: String,
    required: function() {
      return this.type === 'series';
    },
    trim: true
  },
  cast: {
    type: [String],
    default: []
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  duration: {
    type: Number,
    required: function() {
      return this.type === 'movie';
    },
    min: 1
  },
  seasons: {
    type: Number,
    required: function() {
      return this.type === 'series';
    },
    min: 1
  },
  episodes: {
    type: Number,
    required: function() {
      return this.type === 'series';
    },
    min: 1
  },
  type: {
    type: String,
    required: true,
    enum: ['movie', 'series'],
    default: 'movie'
  },
  status: {
    type: String,
    enum: ['Released', 'In Production', 'Planned', 'Canceled', 'Returning Series', 'Ended'],
    default: 'Released'
  },
  posterPath: {
    type: String,
    default: null
  },
  backdropPath: {
    type: String,
    default: null
  },
  tmdbId: {
    type: Number,
    unique: true,
    sparse: true
  },
  trailerUrl: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

movieSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

movieSchema.virtual('posterUrl').get(function() {
  if (!this.posterPath) return null;
  return `https://image.tmdb.org/t/p/w500${this.posterPath}`;
});

movieSchema.virtual('backdropUrl').get(function() {
  if (!this.backdropPath) return null;
  return `https://image.tmdb.org/t/p/w1280${this.backdropPath}`;
});

movieSchema.virtual('thumbnailUrl').get(function() {
  if (!this.posterPath) return null;
  return `https://image.tmdb.org/t/p/w200${this.posterPath}`;
});



movieSchema.set('toJSON', { virtuals: true });
movieSchema.set('toObject', { virtuals: true });

export default mongoose.model('Movie', movieSchema);