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
    message: "Movie & Series Database API",
    version: "1.0.0",
    endpoints: {
      movies: "/api/movies",
      series: "/api/series",
      content: "/api/content",
      search: "/api/movies/search?q=query",
      series_search: "/api/series/search?q=query",
      trending_movies: "/api/movies/trending",
      trending_series: "/api/series/trending",
    },
  });
});

app.use("/api", movieRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API documentation: http://localhost:${PORT}`);
});
