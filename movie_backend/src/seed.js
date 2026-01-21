import dotenv from "dotenv";
import connectDB from "./config/database.js";
import Movie from "./models/Movie.js";
import tmdbService from "./services/tmdbService.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("Connected to database");

    await Movie.deleteMany({});
    console.log("Cleared existing movies");

    const movieCategories = [
      { type: "popular", fetchFn: () => tmdbService.getPopularMovies(1) },
      { type: "top_rated", fetchFn: () => tmdbService.getTopRatedMovies(1) },
      {
        type: "now_playing",
        fetchFn: () => tmdbService.getNowPlayingMovies(1),
      },
    ];

    const seriesCategories = [
      {
        type: "popular_series",
        fetchFn: () => tmdbService.getPopularSeries(1),
      },
      {
        type: "top_rated_series",
        fetchFn: () => tmdbService.getTopRatedSeries(1),
      },
      {
        type: "on_the_air_series",
        fetchFn: () => tmdbService.getOnTheAirSeries(1),
      },
    ];

    const allMovies = new Set();
    const processedMovies = [];

    // Process movies
    for (const category of movieCategories) {
      console.log(`Fetching ${category.type} movies...`);

      try {
        const response = await category.fetchFn();
        const movies = response.results;

        console.log(`Found ${movies.length} ${category.type} movies`);

        for (const movie of movies) {
          if (!allMovies.has(movie.id)) {
            allMovies.add(movie.id);

            try {
              const movieDetails = await tmdbService.getMovieDetails(movie.id);
              const transformedMovie =
                tmdbService.transformMovieData(movieDetails);

              if (transformedMovie.title && transformedMovie.description) {
                processedMovies.push(transformedMovie);
              }
            } catch (error) {
              console.warn(
                `Could not fetch details for movie ID ${movie.id}: ${error.message}`,
              );
              const basicMovie = tmdbService.transformMovieData(movie);
              if (basicMovie.title && basicMovie.description) {
                processedMovies.push(basicMovie);
              }
            }
          }
        }
      } catch (error) {
        console.error(
          `Error fetching ${category.type} movies: ${error.message}`,
        );
      }
    }

    // Process series
    for (const category of seriesCategories) {
      console.log(`Fetching ${category.type}...`);

      try {
        const response = await category.fetchFn();
        const series = response.results;

        console.log(`Found ${series.length} ${category.type}`);

        for (const show of series) {
          if (!allMovies.has(show.id)) {
            allMovies.add(show.id);

            try {
              const seriesDetails = await tmdbService.getSeriesDetails(show.id);
              const transformedSeries =
                tmdbService.transformSeriesData(seriesDetails);

              if (transformedSeries.title && transformedSeries.description) {
                processedMovies.push(transformedSeries);
              }
            } catch (error) {
              console.warn(
                `Could not fetch details for series ID ${show.id}: ${error.message}`,
              );
              const basicSeries = tmdbService.transformSeriesData(show);
              if (basicSeries.title && basicSeries.description) {
                processedMovies.push(basicSeries);
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error fetching ${category.type}: ${error.message}`);
      }
    }

    if (processedMovies.length === 0) {
      console.log("No movies to seed. Creating sample movies...");
      const sampleMovies = [
        {
          title: "The Shawshank Redemption",
          description:
            "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
          releaseYear: 1994,
          genre: ["Drama"],
          director: "Frank Darabont",
          rating: 9.3,
          duration: 142,
          posterPath: "/q6y0Go1tsGEsmtFrydoJoAJdzyL.jpg",
          backdropPath: "/zfbjgQE1uSd9wiPTX4VzsLi0rGG.jpg",
        },
        {
          title: "The Godfather",
          description:
            "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
          releaseYear: 1972,
          genre: ["Crime", "Drama"],
          director: "Francis Ford Coppola",
          rating: 9.2,
          duration: 175,
          posterPath: "/rPdtLWNsZmAtoZl9PK7S2uwE979.jpg",
          backdropPath: "/yGdIoIB4QxFhvMnMtPkFApctfeh.jpg",
        },
        {
          title: "The Dark Knight",
          description:
            "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
          releaseYear: 2008,
          genre: ["Action", "Crime", "Drama"],
          director: "Christopher Nolan",
          rating: 9.0,
          duration: 152,
          posterPath: "/qJ2tW6WMUDuy9C1dNHh2r4c20p1.jpg",
          backdropPath: "/6ffCdEXLl6aI4HBcX5pn2KhV08.jpg",
        },
        {
          title: "Pulp Fiction",
          description:
            "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
          releaseYear: 1994,
          genre: ["Crime", "Drama"],
          director: "Quentin Tarantino",
          rating: 8.9,
          duration: 154,
          posterPath: "/d5iIlFn5s0ImszYzBPb8JPI5XDf.jpg",
          backdropPath: "/sBU6xCKQwt3M4OiLhhP2mBnVmz3.jpg",
        },
        {
          title: "Forrest Gump",
          description:
            "The presidencies of Kennedy and Johnson, the Vietnam War, and the Watergate scandal unfold from the perspective of an Alabama man with an IQ of 75.",
          releaseYear: 1994,
          genre: ["Drama", "Romance"],
          director: "Robert Zemeckis",
          rating: 8.8,
          duration: 142,
          posterPath: "/arw2vcBveWoVZgRrXp3FEo9M3AJ.jpg",
          backdropPath: "/3h1JZGDhZ8nzxdgvkxha0qBqi05.jpg",
        },
      ];

      await Movie.insertMany(sampleMovies);
      console.log(`Created ${sampleMovies.length} sample movies`);
    } else {
      await Movie.insertMany(processedMovies);
      console.log(
        `Successfully seeded ${processedMovies.length} movies and series from TMDB`,
      );
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

const seedDatabaseByMovieName = async (movieNames = []) => {
  try {
    await connectDB();
    console.log("Connected to database");

    if (movieNames.length === 0) {
      console.log("No movie names provided. Using default movie names...");
      movieNames = [
        "Mickey 17",
        "Mission: Impossible – The Final Reckoning",
        "Jurassic World Rebirth",
        "Captain America: Brave New World",
        "Thunderbolts",
        "Zootopia 2",
        "How to Train Your Dragon",
        "Lilo & Stitch",
        "Snow White",
        "The Black Phone 2",
        "Predator: Badlands",
        "The Electric State",
        "Final Destination: Bloodlines",
        "Another Simple Favor",
        "Death of a Unicorn",
        "One Battle After Another",
        "Song Sung Blue",
        "The Long Walk",
        "Bring Her Back",
        "Weapons",
        "Stranger Things",
        "The White Lotus",
        "The Last of Us",
        "Wednesday",
        "Severance",
        "House of the Dragon",
        "The Boys",
        "Andor",
        "Bridgerton",
        "Daredevil: Born Again",
        "The Night Agent",
        "A Knight of the Seven Kingdoms",
        "Lanterns",
        "Wonder Man",
        "Scarpetta",
        "Star Trek: Starfleet Academy",
        "Your Friendly Neighborhood Spider-Man",
        "Young Sherlock",
        "Maya",
        "Adolescence",
        "Goblin (쓸쓸하고 찬란하神-도깨비)",
      ];
    }

    console.log(`Searching for ${movieNames.length} movies...`);
    const processedMovies = [];
    const foundMovies = new Set();

    for (const movieName of movieNames) {
      console.log(`Searching for: "${movieName}"`);

      try {
        const searchResponse = await tmdbService.searchAll(movieName);

        if (searchResponse.results && searchResponse.results.length > 0) {
          // Get the first (most relevant) result
          const content = searchResponse.results[0];

          // Skip if we already processed this content
          if (foundMovies.has(content.id)) {
            console.log(
              `Content "${content.title || content.name}" already processed, skipping...`,
            );
            continue;
          }

          foundMovies.add(content.id);
          console.log(
            `Found: "${content.title || content.name}" (ID: ${content.id}, Type: ${content.media_type})`,
          );

          try {
            // Get detailed information based on media type
            let transformedContent;
            if (
              content.media_type === "tv" ||
              (!content.media_type && content.first_air_date)
            ) {
              const seriesDetails = await tmdbService.getSeriesDetails(
                content.id,
              );
              transformedContent =
                tmdbService.transformSeriesData(seriesDetails);
            } else {
              const movieDetails = await tmdbService.getMovieDetails(
                content.id,
              );
              transformedContent = tmdbService.transformMovieData(movieDetails);
            }

            // Validate required fields
            if (transformedContent.title && transformedContent.description) {
              processedMovies.push(transformedContent);
              console.log(
                `✓ Processed: "${transformedContent.title}" (${transformedContent.type})`,
              );
            } else {
              console.warn(
                `⚠ Skipped "${content.title || content.name}" - missing required fields`,
              );
            }
          } catch (detailError) {
            console.warn(
              `Could not fetch details for "${content.title || content.name}": ${detailError.message}`,
            );

            // Use basic data if details fetch fails
            let basicContent;
            if (
              content.media_type === "tv" ||
              (!content.media_type && content.first_air_date)
            ) {
              basicContent = tmdbService.transformSeriesData(content);
            } else {
              basicContent = tmdbService.transformMovieData(content);
            }

            if (basicContent.title && basicContent.description) {
              processedMovies.push(basicContent);
              console.log(
                `✓ Processed basic info for: "${basicContent.title}"`,
              );
            }
          }
        } else {
          console.warn(`⚠ No results found for: "${movieName}"`);
        }
      } catch (searchError) {
        console.error(
          `Error searching for "${movieName}": ${searchError.message}`,
        );
      }

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    if (processedMovies.length === 0) {
      console.log("No valid movies found to seed.");
      return;
    }

    // Check for existing movies to avoid duplicates
    const existingTmdbIds = await Movie.distinct("tmdbId", {
      tmdbId: { $in: processedMovies.map((m) => m.tmdbId).filter(Boolean) },
    });

    const newMovies = processedMovies.filter(
      (movie) => !movie.tmdbId || !existingTmdbIds.includes(movie.tmdbId),
    );

    if (newMovies.length === 0) {
      console.log("All found movies already exist in database.");
      return;
    }

    // Insert new movies
    const insertedMovies = await Movie.insertMany(newMovies);
    console.log(
      `✓ Successfully added ${insertedMovies.length} new movies to database:`,
    );

    insertedMovies.forEach((movie) => {
      console.log(`  - ${movie.title} (${movie.releaseYear})`);
    });

    console.log("Movie seeding by name completed successfully!");
  } catch (error) {
    console.error("Error seeding database by movie name:", error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

// Command line interface
const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
  case "by-name":
    // Usage: node seed.js by-name "Movie1" "Movie2" "Movie3"
    seedDatabaseByMovieName(args);
    break;
  case "default":
  default:
    seedDatabase();
    break;
}

// Usage:
// # Use default movie names
// node seed.js by-name
// # Specify specific movies
// node seed.js by-name "Inception" "The Matrix" "Interstellar"
// # Use the original seeding method
// node seed.js
// # or
// node seed.js default
