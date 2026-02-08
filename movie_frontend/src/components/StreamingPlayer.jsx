import React, { useState, useRef, useEffect } from "react";
import "./StreamingPlayer.css";

const StreamingPlayer = ({ content, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  // Get first episode for series (memoized)
  const getFirstEpisode = () => {
    if (
      content.type === "series" &&
      content.streamingUrls &&
      content.streamingUrls.length > 0
    ) {
      const sortedEpisodes = [...content.streamingUrls].sort((a, b) => {
        if (a.season !== b.season) return a.season - b.season;
        return a.episode - b.episode;
      });
      return sortedEpisodes[0];
    }
    return null;
  };

  // Initialize selected episode with first episode for series
  const [selectedEpisode, setSelectedEpisode] = useState(() => getFirstEpisode());

  // For movies, use the single streaming URL
  // For series, use the selected episode URL
  const currentStreamingUrl =
    content.type === "movie" ? content.streamingUrl : selectedEpisode?.url;

  useEffect(() => {
    if (videoRef.current && currentStreamingUrl) {
      videoRef.current.load();
    }
  }, [currentStreamingUrl]);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleError = () => {
    setError(
      "Failed to load video. Please check if the streaming URL is valid.",
    );
  };

  const selectEpisode = (episode) => {
    setSelectedEpisode(episode);
    setIsPlaying(false);
    setError(null);
  };

  const getEpisodeTitle = (episode) => {
    return episode.title || `S${episode.season}E${episode.episode}`;
  };

  // Check if streaming is available
  const hasStreaming =
    content.type === "movie"
      ? !!content.streamingUrl
      : content.streamingUrls && content.streamingUrls.length > 0;

  if (!hasStreaming) {
    return (
      <div className="streaming-player-container">
        <div className="streaming-player">
          <div className="no-streaming">
            <h3>No streaming URL available</h3>
            <p>This content doesn't have a streaming URL configured yet.</p>
            <button onClick={onClose} className="btn btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // For series, if no episode is selected yet, show loading
  if (content.type === "series" && !selectedEpisode) {
    return (
      <div className="streaming-player-container">
        <div className="streaming-player">
          <div className="loading-episodes">
            <h3>Loading episodes...</h3>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="streaming-player-container">
      <div className="streaming-player">
        <div className="player-header">
          <h2>{content.title}</h2>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>

        {/* Series Episode Selector */}
        {content.type === "series" &&
          content.streamingUrls &&
          content.streamingUrls.length > 0 && (
            <div className="episode-selector">
              <h3>Select Episode</h3>
              <div className="episodes-grid">
                {Object.entries(
                  content.streamingUrls.reduce((acc, ep) => {
                    if (!acc[ep.season]) acc[ep.season] = [];
                    acc[ep.season].push(ep);
                    return acc;
                  }, {}),
                ).map(([season, episodes]) => (
                  <div key={season} className="season-group">
                    <h4>Season {season}</h4>
                    <div className="episode-list">
                      {episodes
                        .sort((a, b) => a.episode - b.episode)
                        .map((episode) => (
                          <button
                            key={`${season}-${episode.episode}`}
                            onClick={() => selectEpisode(episode)}
                            className={`episode-btn ${
                              selectedEpisode?.season === episode.season &&
                              selectedEpisode?.episode === episode.episode
                                ? "active"
                                : ""
                            }`}
                          >
                            {getEpisodeTitle(episode)}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Video Player */}
        <div className="video-container">
          {error ? (
            <div className="video-error">
              <p>{error}</p>
              <button
                onClick={() => setError(null)}
                className="btn btn-primary"
              >
                Retry
              </button>
            </div>
          ) : (
            <video
              ref={videoRef}
              controls
              className="video-player"
              onError={handleError}
              onPlay={handlePlay}
              onPause={handlePause}
            >
              <source src={currentStreamingUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Player Controls Info */}
        <div className="player-info">
          {content.type === "movie" ? (
            <p>🎬 Movie</p>
          ) : (
            <p>
              📺 Series -{" "}
              {selectedEpisode
                ? getEpisodeTitle(selectedEpisode)
                : "Select an episode"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamingPlayer;
