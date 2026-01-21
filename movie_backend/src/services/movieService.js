import Movie from "../models/Movie.js";

class MovieService {
  async createMovie(movieData) {
    try {
      const movie = new Movie(movieData);
      await movie.save();
      return movie;
    } catch (error) {
      throw new Error(`Error creating content: ${error.message}`);
    }
  }

  async buildFilters(filters) {
    const query = {};

    // Content type filter
    if (filters.type && ['movie', 'series'].includes(filters.type)) {
      query.type = filters.type;
    }

    // Genre filter (array contains)
    if (filters.genre) {
      query.genre = { $in: [filters.genre] };
    }

    // Rating filter (minimum rating)
    if (filters.rating) {
      query.rating = { $gte: filters.rating };
    }

    // Year filter
    if (filters.year) {
      query.releaseYear = filters.year;
    }

    // Status filter
    if (filters.status) {
      query.status = filters.status;
    }

    // Trending filter (high-rated content)
    if (filters.trending) {
      query.rating = { $gte: 7.0 };
    }

    return query;
  }

  async buildSort(sortBy, sortOrder) {
    const sort = {};
    const validSortFields = ['title', 'rating', 'releaseYear', 'createdAt', 'updatedAt'];
    const validSortOrders = ['asc', 'desc'];

    if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder)) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.rating = -1; // Default sort
    }

    return sort;
  }

  async getContent(filters) {
    try {
      const query = await this.buildFilters(filters);
      const sort = await this.buildSort(filters.sortBy, filters.sortOrder);

      const content = await Movie.find(query)
        .sort(sort)
        .limit(filters.limit * 1)
        .skip((filters.page - 1) * filters.limit);

      const total = await Movie.countDocuments(query);

      return {
        data: content,
        totalPages: Math.ceil(total / filters.limit),
        currentPage: filters.page,
        total,
        filters: {
          type: filters.type,
          genre: filters.genre,
          rating: filters.rating,
          year: filters.year,
          status: filters.status,
          trending: filters.trending,
        },
      };
    } catch (error) {
      throw new Error(`Error fetching content: ${error.message}`);
    }
  }

  async getMovieById(id) {
    try {
      const movie = await Movie.findById(id);
      if (!movie) {
        throw new Error("Content not found");
      }
      return movie;
    } catch (error) {
      throw new Error(`Error fetching content: ${error.message}`);
    }
  }

  async updateMovie(id, movieData) {
    try {
      const movie = await Movie.findByIdAndUpdate(id, movieData, {
        new: true,
        runValidators: true,
      });

      if (!movie) {
        throw new Error("Content not found");
      }

      return movie;
    } catch (error) {
      throw new Error(`Error updating content: ${error.message}`);
    }
  }

  async deleteMovie(id) {
    try {
      const movie = await Movie.findByIdAndDelete(id);

      if (!movie) {
        throw new Error("Content not found");
      }

      return movie;
    } catch (error) {
      throw new Error(`Error deleting content: ${error.message}`);
    }
  }

  async buildSearchConditions(query, type) {
    const isNumber = !isNaN(Number(query));

    const searchConditions = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];

    // Genre search (partial match in array)
    searchConditions.push({ genre: { $in: [new RegExp(query, "i")] } });

    // Type-specific search fields
    if (!type || type === 'movie') {
      searchConditions.push({ director: { $regex: query, $options: "i" } });
    }
    
    if (!type || type === 'series') {
      searchConditions.push({ creator: { $regex: query, $options: "i" } });
      searchConditions.push({ cast: { $in: [new RegExp(query, "i")] } });
    }

    // Year search
    if (isNumber) {
      searchConditions.push({ releaseYear: Number(query) });
    }

    return searchConditions;
  }

  async searchContent(filters) {
    try {
      const searchConditions = await this.buildSearchConditions(filters.query, filters.type);
      
      let searchQuery = { $or: searchConditions };

      // Apply additional filters to search
      if (filters.type && ['movie', 'series'].includes(filters.type)) {
        searchQuery.type = filters.type;
      }

      if (filters.genre) {
        searchQuery.genre = { $in: [filters.genre] };
      }

      if (filters.rating) {
        searchQuery.rating = { $gte: filters.rating };
      }

      if (filters.year) {
        searchQuery.releaseYear = filters.year;
      }

      const sort = await this.buildSort(filters.sortBy, filters.sortOrder);

      const content = await Movie.find(searchQuery)
        .sort(sort)
        .limit(filters.limit)
        .skip((filters.page - 1) * filters.limit);

      const total = await Movie.countDocuments(searchQuery);

      return {
        data: content,
        totalPages: Math.ceil(total / filters.limit),
        currentPage: filters.page,
        total,
        searchQuery: filters.query,
        filters: {
          type: filters.type,
          genre: filters.genre,
          rating: filters.rating,
          year: filters.year,
        },
      };
    } catch (error) {
      throw new Error(`Error searching content: ${error.message}`);
    }
  }
}

export default new MovieService();
