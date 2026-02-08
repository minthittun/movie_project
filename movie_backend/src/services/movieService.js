import Movie from "../models/Movie.js";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2 = new S3Client({
  region: "auto",
  endpoint: "https://7bff9df107d8d4bb2a8f0b1665133ddc.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: "e9e1f372a1d4e27e33d093aaa19d48ff",
    secretAccessKey:
      "aa8c88b5e4ac9eb7e4346d064aa93b40f962e844642ae8d41dd9bbae9c5fe5ad",
  },
  forcePathStyle: true,
});

function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}

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
    if (filters.type && ["movie", "series"].includes(filters.type)) {
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
    const validSortFields = [
      "title",
      "rating",
      "releaseYear",
      "createdAt",
      "updatedAt",
    ];
    const validSortOrders = ["asc", "desc"];

    if (
      validSortFields.includes(sortBy) &&
      validSortOrders.includes(sortOrder)
    ) {
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;
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

  async updateStreamingUrl(id, streamingData) {
    try {
      const movie = await Movie.findById(id);
      if (!movie) {
        throw new Error("Content not found");
      }

      let updateData = {};

      if (movie.type === "movie") {
        updateData.streamingUrl = streamingData.url;
      } else if (movie.type === "series") {
        if (streamingData.episodes && Array.isArray(streamingData.episodes)) {
          updateData.streamingUrls = streamingData.episodes;
        } else if (
          streamingData.season &&
          streamingData.episode &&
          streamingData.url
        ) {
          // For single episode updates, we need to fetch current array first
          const currentStreamingUrls = movie.streamingUrls || [];
          const existingIndex = currentStreamingUrls.findIndex(
            (ep) =>
              ep.season === streamingData.season &&
              ep.episode === streamingData.episode,
          );

          const episodeData = {
            season: streamingData.season,
            episode: streamingData.episode,
            url: streamingData.url,
            title: streamingData.title || null,
          };

          const updatedStreamingUrls = [...currentStreamingUrls];
          if (existingIndex >= 0) {
            updatedStreamingUrls[existingIndex] = episodeData;
          } else {
            updatedStreamingUrls.push(episodeData);
          }

          // Sort by season and episode
          updateData.streamingUrls = updatedStreamingUrls.sort((a, b) => {
            if (a.season !== b.season) return a.season - b.season;
            return a.episode - b.episode;
          });
        }
      }

      const updatedMovie = await Movie.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      return updatedMovie;
    } catch (error) {
      throw new Error(`Error updating streaming URLs: ${error.message}`);
    }
  }

  async getStreamingInfo(id) {
    try {
      const movie = await Movie.findById(id);
      if (!movie) {
        throw new Error("Content not found");
      }

      return {
        id: movie._id,
        title: movie.title,
        type: movie.type,
        hasStreaming: movie.hasStreaming,
        streamingInfo: movie.streamingInfo,
      };
    } catch (error) {
      throw new Error(`Error fetching streaming info: ${error.message}`);
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
    if (!type || type === "movie") {
      searchConditions.push({ director: { $regex: query, $options: "i" } });
    }

    if (!type || type === "series") {
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
      const searchConditions = await this.buildSearchConditions(
        filters.query,
        filters.type,
      );

      let searchQuery = { $or: searchConditions };

      // Apply additional filters to search
      if (filters.type && ["movie", "series"].includes(filters.type)) {
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

  async rewriteM3U8(key, filename) {
    if (!filename.endsWith(".m3u8")) {
      throw new Error("Only .m3u8 files are supported");
    }

    const command = new GetObjectCommand({
      Bucket: "movies",
      Key: `${key}/${filename}`,
      ResponseContentType: "application/vnd.apple.mpegurl",
    });

    const m3u8Response = await R2.send(command);
    const body = await streamToString(m3u8Response.Body);

    const lines = body.split("\n");
    const updatedLines = await Promise.all(
      lines.map(async (line) => {
        if (line.trim().endsWith(".ts")) {
          const segmentCommand = new GetObjectCommand({
            Bucket: "movies",
            Key: `${key}/${line.trim()}`,
            ResponseContentType: "video/mp2t",
          });

          const signedUrl = await getSignedUrl(R2, segmentCommand, {
            expiresIn: 86400, // 24 hours
          });
          return signedUrl;
        }
        return line;
      }),
    );

    return updatedLines.join("\n");
  }
}

export default new MovieService();
