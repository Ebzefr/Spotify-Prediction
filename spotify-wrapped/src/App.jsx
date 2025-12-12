import React from 'react';

// Import song images
import peckhamImg from './assets/peckham.jpeg';
import toryImg from './assets/tory.jpeg';
import burnaImg from './assets/burna.jpeg';
import ayaImg from './assets/aya.jpeg';
import vianniImg from './assets/vianni.jpeg';

// Import album images
import bdlmImg from './assets/bdlm.jpeg';
import toldImg from './assets/told.jpeg';
import morayoImg from './assets/morayo.jpeg';
import memoryImg from './assets/memory.jpeg';
import outsideImg from './assets/outside.jpeg';

// Import artist images
import jhusImg from './assets/jhus.jpeg';
import tiakolaImg from './assets/tiakola.jpeg';
import amariaImg from './assets/amaria.jpeg';
import wizkidImg from './assets/wizkid.jpeg';
import rskoImg from './assets/rsko.jpeg';

// Data
const minutesData = {
  "predicted_ms": 984906411.7958508,
  "minutes": 16415.10686326418
};

const songsData = [
  { track_name: "Peckham", predicted_ms: 326870879.3448017 },
  { track_name: "Lady of Neptune", predicted_ms: 147156877.30453116 },
  { track_name: "Like to Party", predicted_ms: 44952909.664827175 },
  { track_name: "Tous les jours", predicted_ms: 29227543.43866352 },
  { track_name: "Recognise", predicted_ms: 18039045.066319652 }
];

const albumsData = [
  { name: "BDLM VOL.1", artist: "Tiakola", image: bdlmImg },
  { name: "I Told Them", artist: "Burna Boy", image: toldImg },
  { name: "Morayo", artist: "Wizkid", image: morayoImg },
  { name: "Memory", artist: "Rsko", image: memoryImg },
  { name: "Outside", artist: "Burna Boy", image: outsideImg }
];

const artistsData = [
  { name: "J Hus", image: jhusImg },
  { name: "Tiakola", image: tiakolaImg },
  { name: "AMARIA BB", image: amariaImg },
  { name: "Wizkid", image: wizkidImg },
  { name: "Rsko", image: rskoImg }
];

const topSongs = [
  { ...songsData[0], artist: "Rsko", image: peckhamImg },
  { ...songsData[1], artist: "Tory Lanez", image: toryImg },
  { ...songsData[2], artist: "Burna Boy", image: burnaImg },
  { ...songsData[3], artist: "Aya Nakamura", image: ayaImg },
  { ...songsData[4], artist: "Vianni", image: vianniImg }
];

// Wavy Checkerboard
const WavyCheckerboard = ({ position, flipped }) => {
  const generateWavyPath = () => {
    const rows = 8;
    const cols = 16;
    const cellWidth = 45;
    const cellHeight = 30;
    const paths = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if ((row + col) % 2 === 0) {
          const baseX = col * cellWidth - 50;
          const baseY = row * cellHeight;
          
          const waveX = (x, y) => {
            const wave1 = Math.sin((y / 60) + (x / 150)) * 20;
            const wave2 = Math.sin((x / 120) + (y / 80)) * 12;
            return x + wave1 + wave2;
          };
          
          const waveY = (x, y) => {
            const wave1 = Math.sin((x / 100) + (y / 60)) * 15;
            const wave2 = Math.cos((y / 150) + (x / 120)) * 8;
            return y + wave1 + wave2;
          };
          
          const p1 = { x: waveX(baseX, baseY), y: waveY(baseX, baseY) };
          const p2 = { x: waveX(baseX + cellWidth, baseY), y: waveY(baseX + cellWidth, baseY) };
          const p3 = { x: waveX(baseX + cellWidth, baseY + cellHeight), y: waveY(baseX + cellWidth, baseY + cellHeight) };
          const p4 = { x: waveX(baseX, baseY + cellHeight), y: waveY(baseX, baseY + cellHeight) };
          
          paths.push(
            <path
              key={`${row}-${col}`}
              d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p4.x} ${p4.y} Z`}
              fill="#1a1a1a"
            />
          );
        }
      }
    }
    return paths;
  };

  return (
    <div className={`checkerboard-container ${position} ${flipped ? 'flipped' : ''}`}>
      <svg 
        viewBox="0 0 700 240" 
        preserveAspectRatio="xMidYMid slice"
        className="checkerboard-svg"
      >
        <rect x="-100" y="-30" width="900" height="350" fill="#F5F5DC"/>
        {generateWavyPath()}
      </svg>
    </div>
  );
};

// Small Checkerboard for corners
const SmallCheckerboard = ({ position = 'bottom-right' }) => {
  const generateWavyPath = () => {
    const rows = 4;
    const cols = 5;
    const cellWidth = 40;
    const cellHeight = 28;
    const paths = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if ((row + col) % 2 === 0) {
          const baseX = col * cellWidth;
          const baseY = row * cellHeight;
          
          const waveX = (x, y) => {
            const wave1 = Math.sin((y / 60) + (x / 150)) * 15;
            return x + wave1;
          };
          
          const waveY = (x, y) => {
            const wave1 = Math.sin((x / 100) + (y / 60)) * 12;
            return y + wave1;
          };
          
          const p1 = { x: waveX(baseX, baseY), y: waveY(baseX, baseY) };
          const p2 = { x: waveX(baseX + cellWidth, baseY), y: waveY(baseX + cellWidth, baseY) };
          const p3 = { x: waveX(baseX + cellWidth, baseY + cellHeight), y: waveY(baseX + cellWidth, baseY + cellHeight) };
          const p4 = { x: waveX(baseX, baseY + cellHeight), y: waveY(baseX, baseY + cellHeight) };
          
          paths.push(
            <path
              key={`${row}-${col}`}
              d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p4.x} ${p4.y} Z`}
              fill="#1a1a1a"
            />
          );
        }
      }
    }
    return paths;
  };

  return (
    <div className={`small-checkerboard ${position}`}>
      <svg 
        viewBox="0 0 200 112" 
        preserveAspectRatio="xMidYMid slice"
        className="checkerboard-svg"
      >
        <rect x="-30" y="-30" width="280" height="200" fill="#F5F5DC"/>
        {generateWavyPath()}
      </svg>
    </div>
  );
};

// Flipping Circles Grid
const FlippingCircles = ({ position = 'bottom-left', rows = 3, cols = 5 }) => {
  const circles = [];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const delay = (row * cols + col) * 0.1;
      const initialColor = (row + col) % 2 === 0 ? 'yellow' : 'black';
      circles.push(
        <div 
          key={`${row}-${col}`} 
          className={`flip-circle ${initialColor}`}
          style={{ animationDelay: `${delay}s` }}
        >
          <div className="flip-circle-inner">
            <div className="flip-circle-front"></div>
            <div className="flip-circle-back"></div>
          </div>
        </div>
      );
    }
  }
  
  return (
    <div className={`flipping-circles-grid ${position}`} style={{ 
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`
    }}>
      {circles}
    </div>
  );
};

// Horizontal Flipping Circles Row
const FlippingCirclesRow = ({ isActive }) => {
  const circles = [];
  const totalCircles = 8;
  
  for (let i = 0; i < totalCircles; i++) {
    const delay = i * 0.15;
    const initialColor = i % 2 === 0 ? 'yellow' : 'black';
    circles.push(
      <div 
        key={i} 
        className={`flip-circle-horizontal ${initialColor} ${isActive ? 'animate' : ''}`}
        style={{ animationDelay: `${delay}s` }}
      >
        <div className="flip-circle-inner">
          <div className="flip-circle-front"></div>
          <div className="flip-circle-back"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flipping-circles-row">
      {circles}
    </div>
  );
};

const SpotifyLogo = ({ size = 'normal', onClick, clickable, variant = 'dark' }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={`spotify-logo ${size} ${clickable ? 'clickable' : ''}`}
    onClick={onClick}
  >
    <circle cx="50" cy="50" r="45" fill={variant === 'light' ? '#E8E8E8' : '#1a1a1a'}/>
    <path 
      className="spotify-bar bar-1"
      d="M25 35 Q50 25 75 35" 
      stroke={variant === 'light' ? '#1a1a1a' : '#F5F5DC'} 
      strokeWidth="8" 
      strokeLinecap="round" 
      fill="none"
    />
    <path 
      className="spotify-bar bar-2"
      d="M30 50 Q50 42 70 50" 
      stroke={variant === 'light' ? '#1a1a1a' : '#F5F5DC'} 
      strokeWidth="7" 
      strokeLinecap="round" 
      fill="none"
    />
    <path 
      className="spotify-bar bar-3"
      d="M35 65 Q50 58 65 65" 
      stroke={variant === 'light' ? '#1a1a1a' : '#F5F5DC'} 
      strokeWidth="6" 
      strokeLinecap="round" 
      fill="none"
    />
  </svg>
);

// SVG Line Components
const PencilLines = () => (
  <svg className="pencil-lines" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
    <path className="pencil-line line-1" d="M-20 250 Q100 230 200 270 T420 300" stroke="#1a1a1a" strokeWidth="1.5" fill="none"/>
    <path className="pencil-line line-2" d="M-20 350 Q150 370 250 330 T420 360" stroke="#1a1a1a" strokeWidth="1.5" fill="none"/>
    <ellipse className="pencil-line line-3" cx="200" cy="400" rx="150" ry="80" stroke="#1a1a1a" strokeWidth="1.5" fill="none" transform="rotate(-5 200 400)"/>
  </svg>
);

const CurvedLines = () => (
  <svg className="curved-lines" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
    <path className="curved-line line-1" d="M-20 180 Q200 280 300 180 T420 220" stroke="#1a1a1a" strokeWidth="1.5" fill="none"/>
    <ellipse className="curved-line line-2" cx="200" cy="350" rx="180" ry="120" stroke="#1a1a1a" strokeWidth="1.5" fill="none" transform="rotate(-5 200 350)"/>
  </svg>
);

const PurpleCurvedLines = () => (
  <svg className="purple-curved-lines" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
    <path className="purple-line line-1" d="M-20 120 Q200 220 300 120 T420 160" stroke="#7B5CF5" strokeWidth="1.5" fill="none"/>
    <ellipse className="purple-line line-2" cx="200" cy="400" rx="200" ry="180" stroke="#7B5CF5" strokeWidth="1.5" fill="none" transform="rotate(-5 200 400)"/>
  </svg>
);

const WhiteCurvedLines = () => (
  <svg className="white-curved-lines" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
    <path className="white-line line-1" d="M-50 80 Q100 250 200 150 T450 200" stroke="#FFFFFF" strokeWidth="1.5" fill="none"/>
    <ellipse className="white-line line-2" cx="200" cy="400" rx="180" ry="150" stroke="#FFFFFF" strokeWidth="1.5" fill="none" transform="rotate(-8 200 400)"/>
  </svg>
);

const PurpleSingleLine = () => (
  <svg className="purple-single-line" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
    <path className="purple-line-single" d="M-50 0 Q50 300 150 400 T-50 800" stroke="#7B5CF5" strokeWidth="1.5" fill="none"/>
  </svg>
);

const WhiteArc = () => (
  <svg className="white-arc" viewBox="0 0 400 150" preserveAspectRatio="xMidYMin slice">
    <path className="arc-line" d="M0 150 Q200 -50 400 150" stroke="#FFFFFF" strokeWidth="1.5" fill="none"/>
  </svg>
);

const BlackCurvedLines = () => (
  <svg className="black-curved-lines" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
    <path className="black-line line-1" d="M-20 40 Q80 150 50 300 T-20 550" stroke="#1a1a1a" strokeWidth="1.5" fill="none"/>
    <path className="black-line line-2" d="M420 80 Q320 200 350 380 T420 600" stroke="#1a1a1a" strokeWidth="1.5" fill="none"/>
    <ellipse className="black-line line-3" cx="220" cy="400" rx="180" ry="120" stroke="#1a1a1a" strokeWidth="1.5" fill="none" transform="rotate(8 220 400)"/>
  </svg>
);

const WhiteSwooshLine = () => (
  <svg className="white-swoosh-line" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
    <path className="white-swoosh" d="M420 40 Q300 80 280 250 T420 500" stroke="#FFFFFF" strokeWidth="1.5" fill="none"/>
  </svg>
);

const SummaryLines = () => (
  <svg className="summary-lines" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
    <path className="summary-line line-1" d="M80 -20 Q100 150 60 300 T100 600" stroke="#1a1a1a" strokeWidth="1.5" fill="none"/>
    <path className="summary-line line-2" d="M350 -20 Q380 100 340 280 T380 500" stroke="#1a1a1a" strokeWidth="1.5" fill="none"/>
    <ellipse className="summary-line line-3" cx="60" cy="350" rx="50" ry="180" stroke="#1a1a1a" strokeWidth="1.5" fill="none" transform="rotate(-8 60 350)"/>
  </svg>
);

// Counting animation hook
const useCountUp = (end, duration = 2000, start = 0, active = false) => {
  const [count, setCount] = React.useState(start);
  
  React.useEffect(() => {
    if (!active) {
      setCount(start);
      return;
    }
    
    let startTime = null;
    let animationFrame;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(start + (end - start) * easeOutQuart);
      setCount(currentCount);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start, active]);
  
  return count;
};

// Screen Components
const Screen1 = ({ isActive }) => (
  <div className="screen screen-1">
    <WavyCheckerboard position="top" />
    <WavyCheckerboard position="bottom" />
    <PencilLines />
    <div className="center-content">
      <div className={`spotify-logo-container ${isActive ? 'animate' : ''}`}>
        <SpotifyLogo size="large" />
      </div>
      <div className={`year-container ${isActive ? 'animate' : ''}`}>
        <span className="year-text">2026</span>
      </div>
    </div>
    <div className={`tap-hint ${isActive ? 'animate' : ''}`}>Swipe to continue</div>
  </div>
);

const Screen2 = ({ isActive }) => (
  <div className="screen screen-2">
    <div className="screen-content">
      <div className={`spotify-logo-container small ${isActive ? 'animate' : ''}`}>
        <SpotifyLogo size="small" />
      </div>
      <h1 className={`predicted-title ${isActive ? 'animate' : ''}`}>Your Predicted Wrap</h1>
      <CurvedLines />
      <div className={`year-text-screen2 ${isActive ? 'animate' : ''}`}>2026</div>
    </div>
    <WavyCheckerboard position="bottom-only" flipped={true} />
  </div>
);

const Screen3 = ({ isActive }) => (
  <div className="screen screen-3">
    <div className="screen-content">
      <div className={`spotify-logo-container small ${isActive ? 'animate' : ''}`}>
        <SpotifyLogo size="small" variant="light" />
      </div>
      <div className={`listened-text ${isActive ? 'animate' : ''}`}>
        <h1>You listened.</h1>
        <h1>We counted.</h1>
      </div>
      <PurpleCurvedLines />
    </div>
    <WavyCheckerboard position="bottom-only" />
  </div>
);

const Screen4 = ({ isActive }) => {
  const totalMinutes = Math.round(minutesData.minutes);
  const displayCount = useCountUp(totalMinutes, 2500, 0, isActive);
  const formattedCount = displayCount.toLocaleString();
  const formattedTotal = totalMinutes.toLocaleString();
  
  return (
    <div className="screen screen-4">
      <div className="screen-content">
        <div className={`spotify-logo-container small ${isActive ? 'animate' : ''}`}>
          <SpotifyLogo size="small" variant="light" />
        </div>
        <div className={`minutes-display ${isActive ? 'animate' : ''}`}>
          <h1 className="minutes-number">{formattedCount}</h1>
          <p className="minutes-text">
            You're predicted to listen for <span className="minutes-highlight">{formattedTotal}</span> minutes
          </p>
        </div>
        <WhiteCurvedLines />
      </div>
      <WavyCheckerboard position="bottom-only" />
    </div>
  );
};

const Screen5 = ({ isActive }) => (
  <div className="screen screen-5">
    <div className="screen-content">
      <div className={`spotify-logo-container small ${isActive ? 'animate' : ''}`}>
        <SpotifyLogo size="small" variant="light" />
      </div>
      <div className={`teaser-text ${isActive ? 'animate' : ''}`}>
        <p className="teaser-line">You're predicted to listen to many songs</p>
        <p className="teaser-line-bold">But can you guess?</p>
        <h1 className="teaser-number">#1</h1>
      </div>
      <PurpleSingleLine />
    </div>
    <WavyCheckerboard position="bottom-only" />
  </div>
);

const Screen6 = ({ isActive }) => (
  <div className="screen screen-6">
    <div className="screen-content">
      <div className={`spotify-logo-container small ${isActive ? 'animate' : ''}`}>
        <SpotifyLogo size="small" variant="light" />
      </div>
      <WhiteArc />
      <h1 className={`top-songs-title ${isActive ? 'animate' : ''}`}>Your top songs</h1>
      <div className="songs-list">
        {topSongs.map((song, index) => (
          <div 
            key={index} 
            className={`song-item ${isActive ? 'animate' : ''}`}
            style={{ animationDelay: `${0.3 + index * 0.12}s` }}
          >
            <span className="song-rank">{index + 1}</span>
            <img src={song.image} alt={song.track_name} className="song-image" />
            <div className="song-info">
              <h3 className="song-title">{song.track_name}</h3>
              <p className="song-artist">{song.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <SmallCheckerboard position="bottom-right" />
  </div>
);

const Screen7 = ({ isActive }) => (
  <div className="screen screen-7">
    <div className="screen-content">
      <div className={`spotify-logo-container small ${isActive ? 'animate' : ''}`}>
        <SpotifyLogo size="small" />
      </div>
      <div className={`albums-teaser-text ${isActive ? 'animate' : ''}`}>
        <p className="teaser-line dark">You're predicted to listen to many albums</p>
        <p className="teaser-line-medium">These are your</p>
        <h1 className="top-5-text">Top 5</h1>
      </div>
      <BlackCurvedLines />
    </div>
    <FlippingCircles position="bottom-left" rows={3} cols={5} />
  </div>
);

const Screen8 = ({ isActive }) => (
  <div className="screen screen-8">
    <div className="screen-content">
      <div className={`spotify-logo-container small ${isActive ? 'animate' : ''}`}>
        <SpotifyLogo size="small" />
      </div>
      <FlippingCirclesRow isActive={isActive} />
      <h1 className={`top-albums-title ${isActive ? 'animate' : ''}`}>Your top albums</h1>
      <div className="albums-grid">
        {albumsData.slice(0, 4).map((album, index) => (
          <div 
            key={index} 
            className={`album-image-item ${isActive ? 'animate' : ''}`}
            style={{ animationDelay: `${0.3 + index * 0.15}s` }}
          >
            <img src={album.image} alt={album.name} />
            <span className="album-number">{index + 1}</span>
          </div>
        ))}
      </div>
      <div className="albums-list">
        <div className="albums-list-left">
          <div className={`album-item ${isActive ? 'animate' : ''}`} style={{ animationDelay: '0.9s' }}>
            <span className="album-rank">1</span>
            <div className="album-info">
              <h3 className="album-name">{albumsData[0].name}</h3>
              <p className="album-artist">{albumsData[0].artist}</p>
            </div>
          </div>
          <div className={`album-item ${isActive ? 'animate' : ''}`} style={{ animationDelay: '1.1s' }}>
            <span className="album-rank">3</span>
            <div className="album-info">
              <h3 className="album-name">{albumsData[2].name}</h3>
              <p className="album-artist">{albumsData[2].artist}</p>
            </div>
          </div>
        </div>
        <div className="albums-list-right">
          <div className={`album-item ${isActive ? 'animate' : ''}`} style={{ animationDelay: '1s' }}>
            <span className="album-rank">2</span>
            <div className="album-info">
              <h3 className="album-name">{albumsData[1].name}</h3>
              <p className="album-artist">{albumsData[1].artist}</p>
            </div>
          </div>
          <div className={`album-item ${isActive ? 'animate' : ''}`} style={{ animationDelay: '1.2s' }}>
            <span className="album-rank">4</span>
            <div className="album-info">
              <h3 className="album-name">{albumsData[3].name}</h3>
              <p className="album-artist">{albumsData[3].artist}</p>
            </div>
          </div>
        </div>
      </div>
      <div className={`album-item album-item-center ${isActive ? 'animate' : ''}`} style={{ animationDelay: '1.3s' }}>
        <span className="album-rank">5</span>
        <div className="album-info">
          <h3 className="album-name">{albumsData[4].name}</h3>
          <p className="album-artist">{albumsData[4].artist}</p>
        </div>
      </div>
    </div>
  </div>
);

const Screen9 = ({ isActive }) => (
  <div className="screen screen-9">
    <div className="screen-content">
      <div className={`spotify-logo-container small ${isActive ? 'animate' : ''}`}>
        <SpotifyLogo size="small" variant="light" />
      </div>
      <div className={`artists-teaser-text ${isActive ? 'animate' : ''}`}>
        <p className="teaser-line light">You're predicted to listen to many artists this year</p>
        <p className="teaser-line-medium light">Here are the</p>
        <h1 className="top-5-text light">Top 5</h1>
      </div>
      <PurpleSingleLine />
    </div>
    <WavyCheckerboard position="bottom-only" />
  </div>
);

const Screen10 = ({ isActive }) => (
  <div className="screen screen-10">
    <div className="screen-content">
      <div className={`spotify-logo-container small ${isActive ? 'animate' : ''}`}>
        <SpotifyLogo size="small" variant="light" />
      </div>
      <h1 className={`top-artists-title ${isActive ? 'animate' : ''}`}>Your top artists</h1>
      <div className="artists-list">
        {artistsData.map((artist, index) => (
          <div 
            key={index} 
            className={`artist-item ${isActive ? 'animate' : ''}`}
            style={{ animationDelay: `${0.3 + index * 0.12}s` }}
          >
            <span className="artist-rank">{index + 1}</span>
            <img src={artist.image} alt={artist.name} className="artist-image" />
            <h3 className="artist-name">{artist.name}</h3>
          </div>
        ))}
      </div>
      <WhiteSwooshLine />
    </div>
    <SmallCheckerboard position="top-left" />
    <SmallCheckerboard position="bottom-right" />
  </div>
);

const Screen11 = ({ isActive }) => {
  const totalMinutes = Math.round(minutesData.minutes);
  const formattedMinutes = totalMinutes.toLocaleString();
  
  return (
    <div className="screen screen-11">
      <div className={`summary-year-text ${isActive ? 'animate' : ''}`}>2026</div>
      <div className="summary-content">
        <div className={`summary-image-container ${isActive ? 'animate' : ''}`}>
          <img src={jhusImg} alt="J Hus" className="summary-main-image" />
        </div>
        <div className="summary-lists">
          <div className="summary-column">
            <h3 className={`summary-label ${isActive ? 'animate' : ''}`}>Top Artists</h3>
            <ul className="summary-items">
              {artistsData.map((artist, index) => (
                <li 
                  key={index} 
                  className={`summary-item ${isActive ? 'animate' : ''}`}
                  style={{ animationDelay: `${0.4 + index * 0.08}s` }}
                >
                  {artist.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="summary-column">
            <h3 className={`summary-label ${isActive ? 'animate' : ''}`}>Top Songs</h3>
            <ul className="summary-items">
              {songsData.map((song, index) => (
                <li 
                  key={index} 
                  className={`summary-item ${isActive ? 'animate' : ''}`}
                  style={{ animationDelay: `${0.4 + index * 0.08}s` }}
                >
                  {song.track_name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={`summary-minutes ${isActive ? 'animate' : ''}`}>
          <p className="summary-minutes-label">Minutes Listened</p>
          <h2 className="summary-minutes-number">{formattedMinutes}</h2>
        </div>
      </div>
      <SummaryLines />
      <SmallCheckerboard position="top-right" />
    </div>
  );
};

function App() {
  const [currentScreen, setCurrentScreen] = React.useState(1);
  const [touchStart, setTouchStart] = React.useState(null);
  const [touchEnd, setTouchEnd] = React.useState(null);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  
  const minSwipeDistance = 50;
  const totalScreens = 11;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isSwipeUp = distance > minSwipeDistance;
    const isSwipeDown = distance < -minSwipeDistance;
    
    if (isTransitioning) return;
    
    if (isSwipeUp && currentScreen < totalScreens) {
      setIsTransitioning(true);
      setCurrentScreen(prev => prev + 1);
      setTimeout(() => setIsTransitioning(false), 800);
    }
    
    if (isSwipeDown && currentScreen > 1) {
      setIsTransitioning(true);
      setCurrentScreen(prev => prev - 1);
      setTimeout(() => setIsTransitioning(false), 800);
    }
  };

  // Mouse wheel support for desktop
  const onWheel = (e) => {
    if (isTransitioning) return;
    
    if (e.deltaY > 30 && currentScreen < totalScreens) {
      setIsTransitioning(true);
      setCurrentScreen(prev => prev + 1);
      setTimeout(() => setIsTransitioning(false), 800);
    }
    
    if (e.deltaY < -30 && currentScreen > 1) {
      setIsTransitioning(true);
      setCurrentScreen(prev => prev - 1);
      setTimeout(() => setIsTransitioning(false), 800);
    }
  };

  return (
    <div 
      className="wrapped-container"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onWheel={onWheel}
    >
      <div className={`screens-wrapper screen-${currentScreen}`}>
        <Screen1 isActive={currentScreen === 1} />
        <Screen2 isActive={currentScreen === 2} />
        <Screen3 isActive={currentScreen === 3} />
        <Screen4 isActive={currentScreen === 4} />
        <Screen5 isActive={currentScreen === 5} />
        <Screen6 isActive={currentScreen === 6} />
        <Screen7 isActive={currentScreen === 7} />
        <Screen8 isActive={currentScreen === 8} />
        <Screen9 isActive={currentScreen === 9} />
        <Screen10 isActive={currentScreen === 10} />
        <Screen11 isActive={currentScreen === 11} />
      </div>
      
      {/* Progress dots */}
      <div className="progress-dots">
        {[...Array(totalScreens)].map((_, i) => (
          <div 
            key={i} 
            className={`dot ${currentScreen === i + 1 ? 'active' : ''}`}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrentScreen(i + 1);
                setTimeout(() => setIsTransitioning(false), 800);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;