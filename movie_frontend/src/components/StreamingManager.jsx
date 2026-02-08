import React, { useState } from 'react';
import './StreamingManager.css';

const StreamingManager = ({ content, onUpdate, onClose }) => {
  const [streamingData, setStreamingData] = useState(() => {
    if (content.type === 'movie') {
      return {
        url: content.streamingUrl || ''
      };
    } else {
      return {
        episodes: content.streamingUrls || [],
        newEpisode: {
          season: 1,
          episode: 1,
          url: '',
          title: ''
        }
      };
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    if (!streamingData.url.trim()) {
      setError('Streaming URL is required');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await onUpdate(content._id, { url: streamingData.url });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update streaming URL');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEpisode = () => {
    const { newEpisode, episodes } = streamingData;
    if (!newEpisode.url.trim()) {
      setError('Episode URL is required');
      return;
    }

    // Check if episode already exists
    const existingIndex = episodes.findIndex(
      ep => ep.season === newEpisode.season && ep.episode === newEpisode.episode
    );

    if (existingIndex >= 0) {
      // Update existing episode
      const updatedEpisodes = [...episodes];
      updatedEpisodes[existingIndex] = { ...newEpisode };
      setStreamingData({
        ...streamingData,
        episodes: updatedEpisodes,
        newEpisode: { season: newEpisode.season, episode: newEpisode.episode + 1, url: '', title: '' }
      });
    } else {
      // Add new episode
      setStreamingData({
        ...streamingData,
        episodes: [...episodes, { ...newEpisode }].sort((a, b) => {
          if (a.season !== b.season) return a.season - b.season;
          return a.episode - b.episode;
        }),
        newEpisode: { season: newEpisode.season, episode: newEpisode.episode + 1, url: '', title: '' }
      });
    }
    setError(null);
  };

  const handleRemoveEpisode = (index) => {
    const updatedEpisodes = streamingData.episodes.filter((_, i) => i !== index);
    setStreamingData({
      ...streamingData,
      episodes: updatedEpisodes
    });
  };

  const handleSeriesSubmit = async (e) => {
    e.preventDefault();
    if (streamingData.episodes.length === 0) {
      setError('At least one episode is required');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await onUpdate(content._id, { episodes: streamingData.episodes });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update streaming URLs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="streaming-manager">
      <div className="streaming-manager-content">
        <div className="manager-header">
          <h2>Manage Streaming - {content.title}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {content.type === 'movie' ? (
          <form onSubmit={handleMovieSubmit} className="movie-streaming-form">
            <div className="form-group">
              <label htmlFor="movieUrl">Streaming URL</label>
              <input
                type="url"
                id="movieUrl"
                value={streamingData.url}
                onChange={(e) => setStreamingData({ ...streamingData, url: e.target.value })}
                placeholder="https://example.com/movie.mp4"
                required
              />
            </div>
            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Streaming URL'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSeriesSubmit} className="series-streaming-form">
            <div className="episodes-section">
              <h3>Episodes</h3>
              
              {/* Add New Episode */}
              <div className="add-episode">
                <h4>Add New Episode</h4>
                <div className="episode-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Season</label>
                      <input
                        type="number"
                        min="1"
                        value={streamingData.newEpisode.season}
                        onChange={(e) => setStreamingData({
                          ...streamingData,
                          newEpisode: { ...streamingData.newEpisode, season: parseInt(e.target.value) || 1 }
                        })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Episode</label>
                      <input
                        type="number"
                        min="1"
                        value={streamingData.newEpisode.episode}
                        onChange={(e) => setStreamingData({
                          ...streamingData,
                          newEpisode: { ...streamingData.newEpisode, episode: parseInt(e.target.value) || 1 }
                        })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Title (Optional)</label>
                    <input
                      type="text"
                      value={streamingData.newEpisode.title}
                      onChange={(e) => setStreamingData({
                        ...streamingData,
                        newEpisode: { ...streamingData.newEpisode, title: e.target.value }
                      })}
                      placeholder="Episode title"
                    />
                  </div>
                  <div className="form-group">
                    <label>Streaming URL</label>
                    <input
                      type="url"
                      value={streamingData.newEpisode.url}
                      onChange={(e) => setStreamingData({
                        ...streamingData,
                        newEpisode: { ...streamingData.newEpisode, url: e.target.value }
                      })}
                      placeholder="https://example.com/s1e1.mp4"
                    />
                  </div>
                  <button type="button" onClick={handleAddEpisode} className="btn btn-secondary">
                    Add Episode
                  </button>
                </div>
              </div>

              {/* Existing Episodes */}
              {streamingData.episodes.length > 0 && (
                <div className="existing-episodes">
                  <h4>Existing Episodes ({streamingData.episodes.length})</h4>
                  <div className="episodes-list">
                    {streamingData.episodes.map((episode, index) => (
                      <div key={index} className="episode-item">
                        <div className="episode-info">
                          <span className="episode-id">S{episode.season}E{episode.episode}</span>
                          {episode.title && <span className="episode-title">{episode.title}</span>}
                        </div>
                        <div className="episode-url">
                          <input
                            type="url"
                            value={episode.url}
                            onChange={(e) => {
                              const updatedEpisodes = [...streamingData.episodes];
                              updatedEpisodes[index] = { ...episode, url: e.target.value };
                              setStreamingData({ ...streamingData, episodes: updatedEpisodes });
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveEpisode(index)}
                          className="btn btn-danger remove-btn"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading || streamingData.episodes.length === 0}>
                {loading ? 'Updating...' : `Update ${streamingData.episodes.length} Episode(s)`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StreamingManager;