class ImageHelper {
  static getPosterUrl(posterPath, size = 'w500') {
    if (!posterPath) return null;
    return `https://image.tmdb.org/t/p/${size}${posterPath}`;
  }

  static getBackdropUrl(backdropPath, size = 'w1280') {
    if (!backdropPath) return null;
    return `https://image.tmdb.org/t/p/${size}${backdropPath}`;
  }

  static getThumbnailUrl(posterPath) {
    return this.getPosterUrl(posterPath, 'w200');
  }

  static getOriginalUrl(imagePath) {
    if (!imagePath) return null;
    return `https://image.tmdb.org/t/p/original${imagePath}`;
  }

  static getImageSizes() {
    return {
      poster: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
      backdrop: ['w300', 'w780', 'w1280', 'original'],
      logo: ['w45', 'w92', 'w154', 'w185', 'w300', 'w500', 'original'],
      profile: ['w45', 'w185', 'h632', 'original'],
      still: ['w92', 'w185', 'w300', 'original']
    };
  }
}

export default ImageHelper;