import React, { useState, useEffect, useRef } from 'react';


// Import images
import peckhamImg from './assets/peckham.jpeg';
import toryImg from './assets/tory.jpeg';
import burnaImg from './assets/burna.jpeg';
import ayaImg from './assets/aya.jpeg';
import vianniImg from './assets/vianni.jpeg';
import bdlmImg from './assets/bdlm.jpeg';
import toldImg from './assets/told.jpeg';
import morayoImg from './assets/morayo.jpeg';
import memoryImg from './assets/memory.jpeg';
import outsideImg from './assets/outside.jpeg';
import jhusImg from './assets/jhus.jpeg';
import tiakolaImg from './assets/tiakola.jpeg';
import amariaImg from './assets/amaria.jpeg';
import wizkidImg from './assets/wizkid.jpeg';
import rskoImg from './assets/rsko.jpeg';

// ========== SPOTIFY API FUNCTIONS ==========
const fetchSpotifyData = async (accessToken) => {
  const headers = { 'Authorization': `Bearer ${accessToken}` };
  
  try {
    const [topArtistsLong, topArtistsMedium, topTracksLong, recentTracks] = await Promise.all([
      fetch('https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50', { headers }).then(r => r.json()),
      fetch('https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=30', { headers }).then(r => r.json()),
      fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50', { headers }).then(r => r.json()),
      fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', { headers }).then(r => r.json())
    ]);

    return {
      top_artists_long: topArtistsLong.items?.map(a => ({
        id: a.id,
        name: a.name,
        image_url: a.images?.[0]?.url,
        genres: a.genres || []
      })) || [],
      top_artists_medium: topArtistsMedium.items?.map(a => ({
        id: a.id,
        name: a.name,
        image_url: a.images?.[0]?.url,
        genres: a.genres || []
      })) || [],
      // FIXED: Include album name and ID
      top_tracks_long: topTracksLong.items?.map(t => ({
        id: t.id,
        name: t.name,
        artist: t.artists?.[0]?.name || 'Unknown',
        album_name: t.album?.name || 'Unknown Album',  // ADD THIS
        album_id: t.album?.id,                          // ADD THIS
        image_url: t.album?.images?.[0]?.url
      })) || [],
      recent_tracks: recentTracks.items?.map(item => ({
        played_at: item.played_at,
        track_name: item.track?.name,
        artist: item.track?.artists?.[0]?.name || 'Unknown',
        duration_ms: item.track?.duration_ms || 180000
      })) || []
    };
  } catch (error) {
    console.error('Error fetching Spotify data:', error);
    return {
      top_artists_long: [],
      top_artists_medium: [],
      top_tracks_long: [],
      recent_tracks: []
    };
  }
};

const generatePredictions = (spotifyData) => {
  console.log('Generating predictions with data:', spotifyData);
  
  // Predict top artists (keep as-is)
  const artistScores = {};
  
  spotifyData.top_artists_long.slice(0, 20).forEach((artist, i) => {
    const score = (20 - i) * 70;
    artistScores[artist.id] = {
      name: artist.name,
      image_url: artist.image_url,
      score: score
    };
  });
  
  spotifyData.top_artists_medium.slice(0, 15).forEach((artist, i) => {
    const score = (15 - i) * 30;
    if (artistScores[artist.id]) {
      artistScores[artist.id].score += score;
    } else {
      artistScores[artist.id] = {
        name: artist.name,
        image_url: artist.image_url,
        score: score
      };
    }
  });
  
  const topArtists = Object.values(artistScores)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((artist, i) => ({
      rank: i + 1,
      name: artist.name,
      image_url: artist.image_url,
      predicted_plays: Math.floor(artist.score * 3)
    }));

  // Predict top tracks (keep as-is)
  const topTracks = spotifyData.top_tracks_long.slice(0, 5).map((track, i) => ({
    rank: i + 1,
    name: track.name,
    artist: track.artist,
    image_url: track.image_url,
    predicted_plays: 500 - (i * 80)
  }));

  // FIXED: Predict top albums - use album data, not track IDs
  const albumMap = {};
  
  spotifyData.top_tracks_long.forEach(track => {
    // Skip tracks without album info
    if (!track.album_name || !track.album_id) return;
    
    // If album not yet tracked, add it
    if (!albumMap[track.album_id]) {
      albumMap[track.album_id] = {
        album_id: track.album_id,
        name: track.album_name,
        artist: track.artist,
        image_url: track.image_url,
        track_count: 1
      };
    } else {
      // Increment track count for this album
      albumMap[track.album_id].track_count++;
    }
  });
  
  // Sort albums by track count (most tracks = most listened album)
  const topAlbums = Object.values(albumMap)
    .sort((a, b) => b.track_count - a.track_count)
    .slice(0, 5)
    .map((album, i) => ({
      rank: i + 1,
      name: album.name,
      artist: album.artist,
      image_url: album.image_url
    }));

  // Ensure we have 5 albums (pad with defaults if needed)
  while (topAlbums.length < 5) {
    topAlbums.push({
      rank: topAlbums.length + 1,
      name: 'Album',
      artist: 'Artist',
      image_url: null
    });
  }

  // Predict total minutes (keep as-is)
  const recentTracks = spotifyData.recent_tracks;
  let totalMinutes = 45000;
  
  if (recentTracks.length > 0) {
    const totalMs = recentTracks.reduce((sum, t) => sum + (t.duration_ms || 180000), 0);
    const avgDurationMin = (totalMs / recentTracks.length) / 60000;
    const tracksPerDay = recentTracks.length / 3;
    const minutesPerDay = tracksPerDay * avgDurationMin;
    totalMinutes = Math.floor(minutesPerDay * 365 * 1.1);
    totalMinutes = Math.max(10000, Math.min(totalMinutes, 100000));
  }

  const predictions = {
    top_artists: topArtists,
    top_tracks: topTracks,
    top_albums: topAlbums,
    total_minutes: totalMinutes,
    year: 2026
  };
  
  console.log('Generated predictions:', predictions);
  return predictions;
};

// ========== HOOKS ==========

const useCountUp = (end, duration = 2500, active = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) { setCount(0); return; }
    let start = null;
    let frame;
    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(end * (1 - Math.pow(1 - progress, 4))));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [end, duration, active]);
  return count;
};

// ========== REUSABLE COMPONENTS ==========

const WavyCheckerboard = ({ position }) => {
  const generateWavyPath = () => {
    const rows = 5;
    const cols = 12;
    const cellWidth = 40;
    const cellHeight = 26;
    const paths = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if ((row + col) % 2 === 0) {
          const baseX = col * cellWidth - 20;
          const baseY = row * cellHeight;
          
          const waveX = (x, y) => x + Math.sin((y / 50) + (x / 120)) * 16 + Math.sin((x / 100) + (y / 70)) * 9;
          const waveY = (x, y) => y + Math.sin((x / 80) + (y / 50)) * 11 + Math.cos((y / 120) + (x / 100)) * 5;
          
          const p1 = { x: waveX(baseX, baseY), y: waveY(baseX, baseY) };
          const p2 = { x: waveX(baseX + cellWidth, baseY), y: waveY(baseX + cellWidth, baseY) };
          const p3 = { x: waveX(baseX + cellWidth, baseY + cellHeight), y: waveY(baseX + cellWidth, baseY + cellHeight) };
          const p4 = { x: waveX(baseX, baseY + cellHeight), y: waveY(baseX, baseY + cellHeight) };
          
          paths.push(<path key={`${row}-${col}`} d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p4.x} ${p4.y} Z`} fill="#1a1a1a"/>);
        }
      }
    }
    return paths;
  };

  return (
    <div className={`checkerboard-container ${position}`}>
      <svg viewBox="0 0 460 130" preserveAspectRatio="xMidYMid slice" className="checkerboard-svg">
        <rect x="-40" y="-15" width="560" height="180" fill="#F5F5DC"/>
        {generateWavyPath()}
      </svg>
    </div>
  );
};

const SmallCheckerboard = ({ position = 'bottom-right' }) => {
  const generateWavyPath = () => {
    const rows = 3;
    const cols = 4;
    const cellWidth = 34;
    const cellHeight = 22;
    const paths = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if ((row + col) % 2 === 0) {
          const baseX = col * cellWidth;
          const baseY = row * cellHeight;
          const waveX = (x, y) => x + Math.sin((y / 50) + (x / 120)) * 10;
          const waveY = (x, y) => y + Math.sin((x / 80) + (y / 50)) * 8;
          
          const p1 = { x: waveX(baseX, baseY), y: waveY(baseX, baseY) };
          const p2 = { x: waveX(baseX + cellWidth, baseY), y: waveY(baseX + cellWidth, baseY) };
          const p3 = { x: waveX(baseX + cellWidth, baseY + cellHeight), y: waveY(baseX + cellWidth, baseY + cellHeight) };
          const p4 = { x: waveX(baseX, baseY + cellHeight), y: waveY(baseX, baseY + cellHeight) };
          
          paths.push(<path key={`${row}-${col}`} d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p4.x} ${p4.y} Z`} fill="#1a1a1a"/>);
        }
      }
    }
    return paths;
  };

  return (
    <div className={`small-checkerboard ${position}`}>
      <svg viewBox="0 0 136 66" preserveAspectRatio="xMidYMid slice" className="checkerboard-svg">
        <rect x="-15" y="-15" width="180" height="110" fill="#F5F5DC"/>
        {generateWavyPath()}
      </svg>
    </div>
  );
};

const FlippingCircles = ({ position = 'bottom-left', rows = 3, cols = 4 }) => {
  const circles = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const delay = (row * cols + col) * 0.1;
      const initialColor = (row + col) % 2 === 0 ? 'yellow' : 'black';
      circles.push(
        <div key={`${row}-${col}`} className={`flip-circle ${initialColor}`} style={{ animationDelay: `${delay}s` }}>
          <div className="flip-circle-inner">
            <div className="flip-circle-front"></div>
            <div className="flip-circle-back"></div>
          </div>
        </div>
      );
    }
  }
  return (
    <div className={`flipping-circles-grid ${position}`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
      {circles}
    </div>
  );
};

const FlippingCirclesRow = ({ isActive }) => {
  const circles = [];
  for (let i = 0; i < 7; i++) {
    const initialColor = i % 2 === 0 ? 'yellow' : 'black';
    circles.push(
      <div key={i} className={`flip-circle-horizontal ${initialColor} ${isActive ? 'animate' : ''}`} style={{ animationDelay: `${i * 0.15}s` }}>
        <div className="flip-circle-inner">
          <div className="flip-circle-front"></div>
          <div className="flip-circle-back"></div>
        </div>
      </div>
    );
  }
  return <div className="flipping-circles-row">{circles}</div>;
};

const SpotifyLogo = ({ size = 'normal', variant = 'dark' }) => (
  <svg viewBox="0 0 100 100" className={`spotify-logo ${size}`}>
    <circle cx="50" cy="50" r="45" fill={variant === 'light' ? '#E8E8E8' : '#1a1a1a'}/>
    <path d="M25 35 Q50 25 75 35" stroke={variant === 'light' ? '#1a1a1a' : '#F5F5DC'} strokeWidth="8" strokeLinecap="round" fill="none"/>
    <path d="M30 50 Q50 42 70 50" stroke={variant === 'light' ? '#1a1a1a' : '#F5F5DC'} strokeWidth="7" strokeLinecap="round" fill="none"/>
    <path d="M35 65 Q50 58 65 65" stroke={variant === 'light' ? '#1a1a1a' : '#F5F5DC'} strokeWidth="6" strokeLinecap="round" fill="none"/>
  </svg>
);

// SVG Lines
const PencilLines = () => (
  <svg className="svg-lines" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
    <path className="line" d="M-20 300 Q100 280 200 320 T420 340" stroke="#1a1a1a" strokeWidth="1.5" fill="none"/>
    <path className="line" d="M-20 400 Q150 420 250 380 T420 410" stroke="#1a1a1a" strokeWidth="1.5" fill="none"/>
    <ellipse className="line" cx="200" cy="430" rx="130" ry="65" stroke="#1a1a1a" strokeWidth="1.5" fill="none" transform="rotate(-5 200 430)"/>
  </svg>
);

const CurvedLines = () => (
  <svg className="svg-lines" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
    <path className="line" d="M-20 160 Q200 260 300 160 T420 200" stroke="#1a1a1a" strokeWidth="1.5" fill="none"/>
    <ellipse className="line" cx="200" cy="360" rx="160" ry="100" stroke="#1a1a1a" strokeWidth="1.5" fill="none" transform="rotate(-5 200 360)"/>
  </svg>
);

const PurpleCircle = () => (
  <svg className="svg-lines" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
    <ellipse className="line" cx="200" cy="320" rx="180" ry="180" stroke="#7B5CF5" strokeWidth="2" fill="none"/>
  </svg>
);

const WhiteCircle = () => (
  <svg className="svg-lines" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
    <ellipse className="line" cx="200" cy="360" rx="180" ry="170" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.35"/>
  </svg>
);

const PurpleLine = () => (
  <svg className="svg-lines" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
    <path className="line" d="M180 -50 Q200 200 160 400 T180 850" stroke="#7B5CF5" strokeWidth="2" fill="none"/>
  </svg>
);

const BlackLines = () => (
  <svg className="svg-lines" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
    <path className="line" d="M-20 60 Q80 170 50 320 T-20 580" stroke="#1a1a1a" strokeWidth="1.5" fill="none"/>
    <path className="line" d="M420 100 Q320 220 350 400 T420 620" stroke="#1a1a1a" strokeWidth="1.5" fill="none"/>
    <ellipse className="line" cx="220" cy="380" rx="150" ry="90" stroke="#1a1a1a" strokeWidth="1.5" fill="none" transform="rotate(8 220 380)"/>
  </svg>
);

const WhiteSwoosh = () => (
  <svg className="svg-lines" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
    <path className="line" d="M420 60 Q300 100 280 280 T420 520" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.5"/>
  </svg>
);

const SummaryLines = () => (
  <svg className="svg-lines" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
    <path className="line" d="M70 -20 Q90 140 50 280 T90 580" stroke="#1a1a1a" strokeWidth="1.5" fill="none"/>
    <path className="line" d="M360 -20 Q390 110 350 260 T390 480" stroke="#1a1a1a" strokeWidth="1.5" fill="none"/>
  </svg>
);

// ========== LANDING PAGE ==========

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    setIsLoading(true);
   console.log('Redirecting to /api/auth');
    
    // Simple redirect to backend
    window.location.href = '/api/auth';
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      color: '#fff',
      zIndex: 1000
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <svg viewBox="0 0 24 24" width="80" height="80" style={{ marginBottom: '20px', animation: 'float 3s ease-in-out infinite' }}>
          <path
            fill="#1DB954"
            d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
          />
        </svg>
        
        <h1 style={{ 
          fontFamily: 'Dela Gothic One, sans-serif', 
          fontSize: 'clamp(32px, 8vw, 56px)', 
          marginBottom: '10px', 
          color: '#1DB954' 
        }}>
          Spotify Wrapped 2026
        </h1>
        
        <p style={{ 
          fontFamily: 'DM Sans, sans-serif', 
          fontSize: '18px', 
          color: '#aaa', 
          marginBottom: '30px' 
        }}>
          See your music future with AI-powered predictions
        </p>

        <button 
          onClick={handleConnect}
          disabled={isLoading}
          style={{
            background: '#1DB954',
            color: '#fff',
            border: 'none',
            padding: '16px 40px',
            fontSize: '18px',
            fontWeight: 700,
            borderRadius: '50px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'DM Sans, sans-serif',
            opacity: isLoading ? 0.6 : 1
          }}
          onMouseEnter={(e) => !isLoading && (e.target.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        >
          {isLoading ? 'Connecting...' : '🎵 Connect Spotify'}
        </button>

        <div style={{ marginTop: '60px' }}>
          <h3 style={{ 
            fontFamily: 'Dela Gothic One, sans-serif', 
            fontSize: '24px', 
            marginBottom: '20px' 
          }}>
            How it works
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '20px' 
          }}>
            {[
              { num: '1', text: 'Connect Spotify' },
              { num: '2', text: 'We analyze your taste' },
              { num: '3', text: 'See 2026 predictions' }
            ].map(step => (
              <div key={step.num} style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                padding: '20px', 
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)' 
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#1DB954',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '20px',
                  margin: '0 auto 12px'
                }}>
                  {step.num}
                </div>
                <p style={{ 
                  fontFamily: 'DM Sans, sans-serif', 
                  fontSize: '14px', 
                  color: '#ccc' 
                }}>
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        fontFamily: 'DM Sans, sans-serif', 
        fontSize: '12px', 
        color: '#666',
        textAlign: 'center'
      }}>
        <p>Built with Prophet ML • Not affiliated with Spotify</p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

// ========== LOADING SCREEN ==========

const LoadingScreen = ({ status }) => (
  <div style={{
    position: 'fixed',
    inset: 0,
    background: '#1a1a1a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontFamily: 'DM Sans, sans-serif',
    zIndex: 1000
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      border: '4px solid #333',
      borderTop: '4px solid #1DB954',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <p style={{ marginTop: '20px', fontSize: '18px' }}>{status}</p>
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// ========== WRAPPED SCREENS ==========

const Screen1 = ({ isActive }) => (
  <div className="screen screen-1">
    <WavyCheckerboard position="top" />
    <WavyCheckerboard position="bottom" />
    <PencilLines />
    <div className="main-content">
      <div className={`logo-wrap ${isActive ? 'animate' : ''}`}><SpotifyLogo size="large" /></div>
      <div className={`year-wrap ${isActive ? 'animate' : ''}`}><span className="year-text">2026</span></div>
    </div>
    <div className={`hint ${isActive ? 'animate' : ''}`}>Swipe to continue</div>
  </div>
);

const Screen2 = ({ isActive }) => (
  <div className="screen screen-2">
    <div className={`logo-wrap small ${isActive ? 'animate' : ''}`}><SpotifyLogo size="small" /></div>
    <h1 className={`title ${isActive ? 'animate' : ''}`}>Your Predicted Wrap</h1>
    <CurvedLines />
    <div className={`year-2026 ${isActive ? 'animate' : ''}`}>2026</div>
    <WavyCheckerboard position="bottom-only" />
  </div>
);

const Screen3 = ({ isActive }) => (
  <div className="screen screen-3">
    <div className={`logo-wrap small ${isActive ? 'animate' : ''}`}><SpotifyLogo size="small" variant="light" /></div>
    <div className={`listened ${isActive ? 'animate' : ''}`}>
      <h1>You listened.</h1>
      <h1>We counted.</h1>
    </div>
    <PurpleCircle />
    <WavyCheckerboard position="bottom-only" />
  </div>
);

const Screen4 = ({ isActive, data }) => {
  const total = data?.total_minutes ? Math.round(data.total_minutes) : 16415;
  const count = useCountUp(total, 2500, isActive);
  return (
    <div className="screen screen-4">
      <div className={`logo-wrap small ${isActive ? 'animate' : ''}`}><SpotifyLogo size="small" variant="light" /></div>
      <div className={`minutes ${isActive ? 'animate' : ''}`}>
        <h1 className="num">{count.toLocaleString()}</h1>
        <p>You're predicted to listen for <strong>{total.toLocaleString()}</strong> minutes</p>
      </div>
      <WhiteCircle />
      <WavyCheckerboard position="bottom-only" />
    </div>
  );
};

const Screen5 = ({ isActive }) => (
  <div className="screen screen-5">
    <div className={`logo-wrap small ${isActive ? 'animate' : ''}`}><SpotifyLogo size="small" variant="light" /></div>
    <div className={`teaser ${isActive ? 'animate' : ''}`}>
      <p>You're predicted to listen to many songs</p>
      <p className="bold">But can you guess?</p>
      <h1>#1</h1>
    </div>
    <PurpleLine />
    <WavyCheckerboard position="bottom-only" />
  </div>
);

const Screen6 = ({ isActive, data }) => {
  const topSongs = data?.top_tracks || [
    { track_name: "Peckham", artist: "Rsko", image: peckhamImg },
    { track_name: "Lady of Neptune", artist: "Tory Lanez", image: toryImg },
    { track_name: "Like to Party", artist: "Burna Boy", image: burnaImg },
    { track_name: "Tous les jours", artist: "Aya Nakamura", image: ayaImg },
    { track_name: "Recognise", artist: "Vianni", image: vianniImg }
  ];

  return (
    <div className="screen screen-6">
      <div className={`logo-wrap small ${isActive ? 'animate' : ''}`}><SpotifyLogo size="small" variant="light" /></div>
      <h1 className={`section-title white-bg ${isActive ? 'animate' : ''}`}>Your top songs</h1>
      <div className="list">
        {topSongs.slice(0, 5).map((s, i) => (
          <div key={i} className={`list-item ${isActive ? 'animate' : ''}`} style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
            <span className="rank">{i + 1}</span>
            <img 
              src={s.image_url || s.image} 
              alt={s.name || s.track_name}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=?'; }}
            />
            <div className="info">
              <h3>{s.name || s.track_name}</h3>
              <p>{s.artist}</p>
            </div>
          </div>
        ))}
      </div>
      <SmallCheckerboard position="bottom-right" />
    </div>
  );
};

const Screen7 = ({ isActive }) => (
  <div className="screen screen-7">
    <div className={`logo-wrap small ${isActive ? 'animate' : ''}`}><SpotifyLogo size="small" /></div>
    <div className={`teaser dark ${isActive ? 'animate' : ''}`}>
      <p>You're predicted to listen to many albums</p>
      <p className="med">These are your</p>
      <h1>Top 5</h1>
    </div>
    <BlackLines />
    <FlippingCircles position="bottom-left" rows={3} cols={4} />
  </div>
);

const Screen8 = ({ isActive, data }) => {
  const albumsData = data?.top_albums || [
    { name: "BDLM VOL.1", artist: "Tiakola", image: bdlmImg },
    { name: "I Told Them", artist: "Burna Boy", image: toldImg },
    { name: "Morayo", artist: "Wizkid", image: morayoImg },
    { name: "Memory", artist: "Rsko", image: memoryImg },
    { name: "Outside", artist: "Burna Boy", image: outsideImg }
  ];

  const albums = albumsData.length >= 5 ? albumsData : [
    ...albumsData,
    ...Array(5 - albumsData.length).fill({ name: "Album", artist: "Artist", image: bdlmImg })
  ];

  return (
    <div className="screen screen-8">
      <div className={`logo-wrap small ${isActive ? 'animate' : ''}`}><SpotifyLogo size="small" /></div>
      <FlippingCirclesRow isActive={isActive} />
      <h1 className={`section-title yellow-bg ${isActive ? 'animate' : ''}`}>Your top albums</h1>
      
      <div className="list" style={{ maxWidth: '340px' }}>
        {albums.map((a, i) => (
          <div key={i} className={`list-item ${isActive ? 'animate' : ''}`} style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
            <span className="rank" style={{ color: '#1a1a1a' }}>{i + 1}</span>
            <img 
              src={a.image_url || a.image} 
              alt={a.name}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=?'; }}
            />
            <div className="info">
              <h3 style={{ color: '#1a1a1a' }}>{a.name}</h3>
              <p style={{ color: '#666' }}>{a.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Screen9 = ({ isActive }) => (
  <div className="screen screen-9">
    <div className={`logo-wrap small ${isActive ? 'animate' : ''}`}><SpotifyLogo size="small" variant="light" /></div>
    <div className={`teaser ${isActive ? 'animate' : ''}`}>
      <p>You're predicted to listen to many artists this year</p>
      <p className="med">Here are the</p>
      <h1>Top 5</h1>
    </div>
    <PurpleLine />
    <WavyCheckerboard position="bottom-only" />
  </div>
);

const Screen10 = ({ isActive, data }) => {
  const artistsData = data?.top_artists || [
    { name: "J Hus", image: jhusImg },
    { name: "Tiakola", image: tiakolaImg },
    { name: "AMARIA BB", image: amariaImg },
    { name: "Wizkid", image: wizkidImg },
    { name: "Rsko", image: rskoImg }
  ];

  return (
    <div className="screen screen-10">
      <div className={`logo-wrap small ${isActive ? 'animate' : ''}`}><SpotifyLogo size="small" variant="light" /></div>
      <h1 className={`section-title white-bg ${isActive ? 'animate' : ''}`}>Your top artists</h1>
      <div className="list">
        {artistsData.map((a, i) => (
          <div key={i} className={`list-item ${isActive ? 'animate' : ''}`} style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
            <span className="rank">{i + 1}</span>
            <img 
              src={a.image_url || a.image} 
              alt={a.name}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=?'; }}
            />
            <h3 className="artist-name-tag">{a.name}</h3>
          </div>
        ))}
      </div>
      <WhiteSwoosh />
      <SmallCheckerboard position="top-left" />
      <SmallCheckerboard position="bottom-right" />
    </div>
  );
};

const Screen11 = ({ isActive, data }) => {
  const total = data?.total_minutes ? Math.round(data.total_minutes) : 16415;
  const artistsData = data?.top_artists || [/* fallback data */];
  const songsData = data?.top_tracks || [/* fallback data */];

  const handleShare = () => {
    const text = `🎵 My Spotify Wrapped 2026 Prediction:\n\n` +
      `Top Artist: ${artistsData[0]?.name}\n` +
      `Top Song: ${songsData[0]?.name}\n` +
      `Total Minutes: ${total.toLocaleString()}\n\n` +
      `Get your prediction at spotify-prediction-rosy.vercel.app`;

    if (navigator.share) {
      navigator.share({
        title: 'My Spotify Wrapped 2026 Prediction',
        text: text
      }).catch(() => {});
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
      });
    }
  };

  return (
    <div className="screen screen-11">
      <div className={`big-year ${isActive ? 'animate' : ''}`}>2026</div>
      <div className="summary">
        <div className={`main-img ${isActive ? 'animate' : ''}`}>
          <img src={artistsData[0]?.image_url || jhusImg} alt={artistsData[0]?.name} />
        </div>
        <div className="cols">
          <div className="col">
            <h3 className={isActive ? 'animate' : ''}>Top Artists</h3>
            <ul>{artistsData.map((a, i) => <li key={i} className={isActive ? 'animate' : ''} style={{ animationDelay: `${0.3 + i * 0.06}s` }}>{a.name}</li>)}</ul>
          </div>
          <div className="col">
            <h3 className={isActive ? 'animate' : ''}>Top Songs</h3>
            <ul>{songsData.map((s, i) => <li key={i} className={isActive ? 'animate' : ''} style={{ animationDelay: `${0.3 + i * 0.06}s` }}>{s.name || s.track_name}</li>)}</ul>
          </div>
        </div>
        <div className={`final-mins ${isActive ? 'animate' : ''}`}>
          <p>Minutes Listened</p>
          <h2>{total.toLocaleString()}</h2>
        </div>
      </div>
      <SummaryLines />
      <SmallCheckerboard position="top-right" />
    <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        zIndex: 20
      }}>
    <button 
        className={`share-btn ${isActive ? 'animate' : ''}`}
        onClick={handleShare}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1DB954',
          color: '#fff',
          border: 'none',
          padding: '12px 30px',
          fontSize: '14px',
          fontWeight: 700,
          borderRadius: '25px',
          cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif',
          zIndex: 20,
          opacity: 0,
          animation: isActive ? 'fadeUp 0.5s ease-out 1.2s forwards' : 'none'
        }}
      >
       Share My Prediction
      </button>
      <button 
          className={`reset-btn ${isActive ? 'animate' : ''}`}
          onClick={() => {
            window.location.href = '/';
          }}
          style={{
            background: 'transparent',
            color: '#1a1a1a',
            border: '2px solid #1a1a1a',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 700,
            borderRadius: '25px',
            cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            opacity: 0,
            animation: isActive ? 'fadeUp 0.5s ease-out 1.3s forwards' : 'none'
          }}
        >
           Create Again
        </button>
      </div>
    </div>  
  );
};

// ========== MAIN APP ==========

function App() {
  const [appState, setAppState] = useState('landing');
  const [loadingStatus, setLoadingStatus] = useState('Authenticating...');
  const [predictionData, setPredictionData] = useState(null);
  const [error, setError] = useState(null); // ADD THIS
  const [screen, setScreen] = useState(1);
  const [touchY, setTouchY] = useState(null);
  const [locked, setLocked] = useState(false);
  const total = 11;
  const hasProcessedCode = useRef(false);

   if (error) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: '#1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: 'DM Sans, sans-serif',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>😕</h1>
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Oops! Something went wrong</h2>
        <p style={{ color: '#aaa', marginBottom: '30px' }}>{error}</p>
        <button 
          onClick={() => {
            setError(null);
            setAppState('landing');
          }}
          style={{
            background: '#1DB954',
            color: '#fff',
            border: 'none',
            padding: '12px 30px',
            fontSize: '16px',
            borderRadius: '25px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code && !hasProcessedCode.current) {
      hasProcessedCode.current = true;
      handleOAuthCallback(code);
    }
  }, []);

  const handleOAuthCallback = async () => {
  setAppState('loading');
  
  try {
    setLoadingStatus('Fetching your Spotify data...');
    
    // Call backend API (token is in cookie, handled server-side)
    const dataResponse = await fetch('/api/fetch-spotify-data', {
      credentials: 'include' // Important: include cookies
    });
    
    if (!dataResponse.ok) {
      throw new Error('Failed to fetch Spotify data');
    }
    
    const spotifyData = await dataResponse.json();
    console.log('Spotify data:', spotifyData);

    setLoadingStatus('Generating your 2026 predictions...');
    const predictions = generatePredictions(spotifyData);
    console.log('Predictions:', predictions);

    setPredictionData(predictions);
    window.history.replaceState({}, document.title, '/');
    
    setTimeout(() => {
      setAppState('wrapped');
      setScreen(1);
    }, 1000);

  } catch (error) {
    console.error('Error:', error);
    setLoadingStatus(`Error: ${error.message}`);
    setTimeout(() => {
      setAppState('landing');
    }, 3000);
  }
};

useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const session = urlParams.get('session');
  const error = urlParams.get('error');
  
  if (error) {
    alert(`Authentication error: ${error}`);
    return;
  }
  
  if (session && !hasProcessedCode.current) {
    hasProcessedCode.current = true;
    handleOAuthCallback();
  }
}, []);

  const go = (dir) => {
    if (locked) return;
    const next = screen + dir;
    if (next < 1 || next > total) return;
    setLocked(true);
    setScreen(next);
    setTimeout(() => setLocked(false), 700);
  };

  if (appState === 'landing') {
    return <LandingPage />;
  }

  if (appState === 'loading') {
    return <LoadingScreen status={loadingStatus} />;
  }

  return (
    <div 
      className="app" 
      onTouchStart={e => setTouchY(e.touches[0].clientY)} 
      onTouchEnd={e => {
        if (touchY === null) return;
        const diff = touchY - e.changedTouches[0].clientY;
        if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
        setTouchY(null);
      }} 
      onWheel={e => { if (Math.abs(e.deltaY) > 30) go(e.deltaY > 0 ? 1 : -1); }}
    >
      <div className={`wrapper s${screen}`}>
        <Screen1 isActive={screen === 1} />
        <Screen2 isActive={screen === 2} />
        <Screen3 isActive={screen === 3} />
        <Screen4 isActive={screen === 4} data={predictionData} />
        <Screen5 isActive={screen === 5} />
        <Screen6 isActive={screen === 6} data={predictionData} />
        <Screen7 isActive={screen === 7} />
        <Screen8 isActive={screen === 8} data={predictionData} />
        <Screen9 isActive={screen === 9} />
        <Screen10 isActive={screen === 10} data={predictionData} />
        <Screen11 isActive={screen === 11} data={predictionData} />
      </div>
    </div>
  );
}

export default App;