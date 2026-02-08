import { Router } from "express";
import movieController from "../controllers/movieController.js";

const router = Router();

// Unified content endpoint
router.post("/content", movieController.createMovie);
router.get("/content", movieController.getContent);
router.get("/content/search", movieController.searchContent);
router.get("/content/:id", movieController.getMovieById);
router.put("/content/:id", movieController.updateMovie);
router.delete("/content/:id", movieController.deleteMovie);

// Streaming endpoints
router.put("/content/:id/streaming", movieController.updateStreamingUrl);
router.get("/content/:id/streaming", movieController.getStreamingInfo);
router.get(
  "/content/get-signed-url/:key/:filename",
  movieController.generateSignedStreamUrl,
);

export default router;
