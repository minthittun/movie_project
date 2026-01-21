import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";
import movieRoutes from "./routes/movieRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Unified Content API - Movies & Series",
    version: "2.0.0",
    unified_endpoint: "/api/content",
    parameters: {
      type: "movie|series (filter by content type)",
      genre: "string (filter by genre)",
      rating: "number (minimum rating filter)",
      year: "number (filter by release year)",
      status: "string (filter by status)",
      trending: "true|false (filter trending content)",
      page: "number (pagination)",
      limit: "number (items per page)",
      sortBy: "title|rating|releaseYear|createdAt|updatedAt",
      sortOrder: "asc|desc",
    },
    examples: {
      all_content: "/api/content",
      movies_only: "/api/content?type=movie",
      trending_series: "/api/content?type=series&trending=true",
      action_movies_high_rating: "/api/content?type=movie&genre=Action&rating=7.5",
      search: "/api/content/search?q=dragon&type=movie",
    },
    legacy_endpoints: {
      movies: "/api/movies (redirects to /api/content)",
      series: "/api/series (redirects to /api/content)",
    },
  });
});

app.use("/api", movieRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API documentation: http://localhost:${PORT}`);
});
