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

// Map song data with artist and image
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
    const rows = 12;
    const cols = 24;
    const cellWidth = 55;
    const cellHeight = 35;
    const paths = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if ((row + col) % 2 === 0) {
          const baseX = col * cellWidth - 100;
          const baseY = row * cellHeight;
          
          const waveX = (x, y) => {
            const wave1 = Math.sin((y / 80) + (x / 200)) * 25;
            const wave2 = Math.sin((x / 150) + (y / 100)) * 15;
            return x + wave1 + wave2;
          };
          
          const waveY = (x, y) => {
            const wave1 = Math.sin((x / 120) + (y / 80)) * 20;
            const wave2 = Math.cos((y / 200) + (x / 150)) * 10;
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
        viewBox="0 0 1200 420" 
        preserveAspectRatio="xMidYMid slice"
        className="checkerboard-svg"
      >
        <rect x="-200" y="-50" width="1600" height="600" fill="#F5F5DC"/>
        {generateWavyPath()}
      </svg>
    </div>
  );
};

// Small Checkerboard for corners
const SmallCheckerboard = ({ position = 'bottom-right' }) => {
  const generateWavyPath = () => {
    const rows = 6;
    const cols = 8;
    const cellWidth = 55;
    const cellHeight = 35;
    const paths = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if ((row + col) % 2 === 0) {
          const baseX = col * cellWidth;
          const baseY = row * cellHeight;
          
          const waveX = (x, y) => {
            const wave1 = Math.sin((y / 80) + (x / 200)) * 20;
            return x + wave1;
          };
          
          const waveY = (x, y) => {
            const wave1 = Math.sin((x / 120) + (y / 80)) * 15;
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
        viewBox="0 0 440 210" 
        preserveAspectRatio="xMidYMid slice"
        className="checkerboard-svg"
      >
        <rect x="-50" y="-50" width="540" height="310" fill="#F5F5DC"/>
        {generateWavyPath()}
      </svg>
    </div>
  );
};

// Flipping Circles Grid
const FlippingCircles = ({ position = 'bottom-left', rows = 3, cols = 6 }) => {
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
  const totalCircles = 14;
  
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

// Pencil Lines for Screen 1
const PencilLines = () => (
  <svg className="pencil-lines" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
    <path className="pencil-line line-1" d="M-50 300 Q200 280 400 320 T800 290 T1250 350" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
    <path className="pencil-line line-2" d="M-50 400 Q300 420 500 380 T900 420 T1250 380" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
    <path className="pencil-line line-3" d="M-50 500 Q250 480 450 520 T850 490 T1250 530" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
    <ellipse className="pencil-line line-4" cx="600" cy="400" rx="280" ry="120" stroke="#1a1a1a" strokeWidth="2" fill="none" transform="rotate(-5 600 400)"/>
    <ellipse className="pencil-line line-5" cx="600" cy="400" rx="320" ry="140" stroke="#1a1a1a" strokeWidth="2" fill="none" transform="rotate(3 600 400)"/>
  </svg>
);

// Curved Lines for Screen 2
const CurvedLines = () => (
  <svg className="curved-lines" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
    <path className="curved-line line-1" d="M-50 200 Q400 350 600 200 T1250 250" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
    <path className="curved-line line-2" d="M-50 250 Q300 450 700 280 T1250 350" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
    <ellipse className="curved-line line-3" cx="600" cy="350" rx="450" ry="200" stroke="#1a1a1a" strokeWidth="2" fill="none" transform="rotate(-8 600 350)"/>
    <ellipse className="curved-line line-4" cx="600" cy="350" rx="500" ry="230" stroke="#1a1a1a" strokeWidth="2" fill="none" transform="rotate(5 600 350)"/>
  </svg>
);

// Purple Curved Lines for Screen 3
const PurpleCurvedLines = () => (
  <svg className="purple-curved-lines" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
    <path className="purple-line line-1" d="M-50 150 Q400 300 700 150 T1250 200" stroke="#7B5CF5" strokeWidth="2" fill="none"/>
    <ellipse className="purple-line line-2" cx="600" cy="450" rx="550" ry="350" stroke="#7B5CF5" strokeWidth="2" fill="none" transform="rotate(-5 600 450)"/>
  </svg>
);

// White Curved Lines for Screen 4
const WhiteCurvedLines = () => (
  <svg className="white-curved-lines" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
    <path className="white-line line-1" d="M-100 100 Q200 400 500 200 T1300 300" stroke="#FFFFFF" strokeWidth="2" fill="none"/>
    <path className="white-line line-2" d="M-50 600 Q400 300 700 500 T1250 400" stroke="#FFFFFF" strokeWidth="2" fill="none"/>
    <ellipse className="white-line line-3" cx="600" cy="400" rx="500" ry="300" stroke="#FFFFFF" strokeWidth="2" fill="none" transform="rotate(-10 600 400)"/>
  </svg>
);

// Purple Line for Screen 5 & 9
const PurpleSingleLine = () => (
  <svg className="purple-single-line" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
    <path className="purple-line-single" d="M-100 0 Q100 400 300 500 T-100 800" stroke="#7B5CF5" strokeWidth="2" fill="none"/>
  </svg>
);

// White Arc for Screen 6
const WhiteArc = () => (
  <svg className="white-arc" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMin slice">
    <path className="arc-line" d="M0 200 Q600 -100 1200 200" stroke="#FFFFFF" strokeWidth="2" fill="none"/>
  </svg>
);

// Black Curved Lines for Screen 7
const BlackCurvedLines = () => (
  <svg className="black-curved-lines" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
    <path className="black-line line-1" d="M-50 50 Q200 200 100 400 T-50 700" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
    <path className="black-line line-2" d="M50 -50 Q300 150 200 350 T50 650" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
    <path className="black-line line-3" d="M1250 100 Q900 300 1000 500 T1250 750" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
    <ellipse className="black-line line-4" cx="700" cy="450" rx="500" ry="280" stroke="#1a1a1a" strokeWidth="2" fill="none" transform="rotate(10 700 450)"/>
  </svg>
);

// White Swoosh Line for Screen 10
const WhiteSwooshLine = () => (
  <svg className="white-swoosh-line" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
    <path className="white-swoosh" d="M1300 50 Q900 100 800 300 T1300 600" stroke="#FFFFFF" strokeWidth="2" fill="none"/>
  </svg>
);

// Summary Screen Lines
const SummaryLines = () => (
  <svg className="summary-lines" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
    <path className="summary-line line-1" d="M200 -50 Q250 200 150 400 T250 850" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
    <path className="summary-line line-2" d="M1000 -50 Q1100 150 950 350 T1050 600" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
    <path className="summary-line line-3" d="M400 750 Q700 700 1000 780" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
    <ellipse className="summary-line line-4" cx="150" cy="400" rx="100" ry="300" stroke="#1a1a1a" strokeWidth="2" fill="none" transform="rotate(-10 150 400)"/>
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

// Screen 1: Intro with 2026
const Screen1 = ({ onLogoClick }) => (
  <div className="screen screen-1">
    <WavyCheckerboard position="top" />
    <WavyCheckerboard position="bottom" />
    <PencilLines />
    <div className="center-content">
      <div className="spotify-logo-container">
        <SpotifyLogo size="large" onClick={onLogoClick} clickable={true} />
      </div>
      <div className="year-container">
        <span className="year-text">2026</span>
      </div>
    </div>
    <div className="tap-hint">Tap logo to continue</div>
  </div>
);

// Screen 2: Your Predicted Wrap
const Screen2 = ({ onLogoClick }) => (
  <div className="screen screen-2">
    <div className="screen2-content">
      <div className="spotify-logo-container small">
        <SpotifyLogo size="small" onClick={onLogoClick} clickable={true} />
      </div>
      <h1 className="predicted-title">Your Predicted Wrap</h1>
      <CurvedLines />
      <div className="year-text-screen2">2026</div>
    </div>
    <WavyCheckerboard position="bottom-only" flipped={true} />
  </div>
);

// Screen 3: You listened. We counted.
const Screen3 = ({ onLogoClick }) => (
  <div className="screen screen-3">
    <div className="screen3-content">
      <div className="spotify-logo-container small">
        <SpotifyLogo size="small" variant="light" onClick={onLogoClick} clickable={true} />
      </div>
      <div className="listened-text">
        <h1>You listened.</h1>
        <h1>We counted.</h1>
      </div>
      <PurpleCurvedLines />
    </div>
    <WavyCheckerboard position="bottom-only" />
  </div>
);

// Screen 4: Minutes listened
const Screen4 = ({ onLogoClick, isActive }) => {
  const totalMinutes = Math.round(minutesData.minutes);
  const displayCount = useCountUp(totalMinutes, 2500, 0, isActive);
  
  const formattedCount = displayCount.toLocaleString();
  const formattedTotal = totalMinutes.toLocaleString();
  
  return (
    <div className="screen screen-4">
      <div className="screen4-content">
        <div className="spotify-logo-container small">
          <SpotifyLogo size="small" variant="light" onClick={onLogoClick} clickable={true} />
        </div>
        <div className="minutes-display">
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

// Screen 5: Songs teaser
const Screen5 = ({ onLogoClick }) => (
  <div className="screen screen-5">
    <div className="screen5-content">
      <div className="spotify-logo-container small">
        <SpotifyLogo size="small" variant="light" onClick={onLogoClick} clickable={true} />
      </div>
      <div className="teaser-text">
        <p className="teaser-line">You're predicted to listen to many songs</p>
        <p className="teaser-line-bold">But can you guess?</p>
        <h1 className="teaser-number">#1</h1>
      </div>
      <PurpleSingleLine />
    </div>
    <WavyCheckerboard position="bottom-only" />
  </div>
);

// Screen 6: Top Songs
const Screen6 = ({ onLogoClick, isActive }) => (
  <div className="screen screen-6">
    <div className="screen6-content">
      <div className="spotify-logo-container small">
        <SpotifyLogo size="small" variant="light" onClick={onLogoClick} clickable={true} />
      </div>
      <WhiteArc />
      <h1 className="top-songs-title">Your top songs</h1>
      <div className="songs-list">
        {topSongs.map((song, index) => (
          <div 
            key={index} 
            className={`song-item ${isActive ? 'animate' : ''}`}
            style={{ animationDelay: `${0.3 + index * 0.15}s` }}
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

// Screen 7: Albums teaser
const Screen7 = ({ onLogoClick, isActive }) => (
  <div className="screen screen-7">
    <div className="screen7-content">
      <div className="spotify-logo-container small">
        <SpotifyLogo size="small" onClick={onLogoClick} clickable={true} />
      </div>
      <div className="albums-teaser-text">
        <p className="teaser-line dark">You're predicted to listen to many albums</p>
        <p className="teaser-line-medium">These are your</p>
        <h1 className="top-5-text">Top 5</h1>
      </div>
      <BlackCurvedLines />
    </div>
    <FlippingCircles position="bottom-left" rows={3} cols={6} />
  </div>
);

// Screen 8: Top Albums
const Screen8 = ({ onLogoClick, isActive }) => (
  <div className="screen screen-8">
    <div className="screen8-content">
      <div className="spotify-logo-container small">
        <SpotifyLogo size="small" onClick={onLogoClick} clickable={true} />
      </div>
      <FlippingCirclesRow isActive={isActive} />
      <h1 className="top-albums-title">Your top songs</h1>
      <div className="albums-grid">
        {albumsData.slice(0, 4).map((album, index) => (
          <div 
            key={index} 
            className={`album-image-item ${isActive ? 'animate' : ''}`}
            style={{ animationDelay: `${0.3 + index * 0.2}s` }}
          >
            <img src={album.image} alt={album.name} />
            <span className="album-number">{index + 1}</span>
          </div>
        ))}
      </div>
      <div className="albums-list">
        <div className="albums-list-left">
          <div className={`album-item ${isActive ? 'animate' : ''}`} style={{ animationDelay: '1.1s' }}>
            <span className="album-rank">1</span>
            <div className="album-info">
              <h3 className="album-name">{albumsData[0].name}</h3>
              <p className="album-artist">{albumsData[0].artist}</p>
            </div>
          </div>
          <div className={`album-item ${isActive ? 'animate' : ''}`} style={{ animationDelay: '1.3s' }}>
            <span className="album-rank">3</span>
            <div className="album-info">
              <h3 className="album-name">{albumsData[2].name}</h3>
              <p className="album-artist">{albumsData[2].artist}</p>
            </div>
          </div>
        </div>
        <div className="albums-list-right">
          <div className={`album-item ${isActive ? 'animate' : ''}`} style={{ animationDelay: '1.2s' }}>
            <span className="album-rank">2</span>
            <div className="album-info">
              <h3 className="album-name">{albumsData[1].name}</h3>
              <p className="album-artist">{albumsData[1].artist}</p>
            </div>
          </div>
          <div className={`album-item ${isActive ? 'animate' : ''}`} style={{ animationDelay: '1.4s' }}>
            <span className="album-rank">4</span>
            <div className="album-info">
              <h3 className="album-name">{albumsData[3].name}</h3>
              <p className="album-artist">{albumsData[3].artist}</p>
            </div>
          </div>
        </div>
      </div>
      <div className={`album-item album-item-center ${isActive ? 'animate' : ''}`} style={{ animationDelay: '1.5s' }}>
        <span className="album-rank">5</span>
        <div className="album-info">
          <h3 className="album-name">{albumsData[4].name}</h3>
          <p className="album-artist">{albumsData[4].artist}</p>
        </div>
      </div>
    </div>
  </div>
);

// Screen 9: Artists teaser
const Screen9 = ({ onLogoClick }) => (
  <div className="screen screen-9">
    <div className="screen9-content">
      <div className="spotify-logo-container small">
        <SpotifyLogo size="small" variant="light" onClick={onLogoClick} clickable={true} />
      </div>
      <div className="artists-teaser-text">
        <p className="teaser-line light">You're predicted to listen to many artists this year</p>
        <p className="teaser-line-medium light">Here are the</p>
        <h1 className="top-5-text light">Top 5</h1>
      </div>
      <PurpleSingleLine />
    </div>
    <WavyCheckerboard position="bottom-only" />
  </div>
);

// Screen 10: Top Artists
const Screen10 = ({ onLogoClick, isActive }) => (
  <div className="screen screen-10">
    <div className="screen10-content">
      <div className="spotify-logo-container small">
        <SpotifyLogo size="small" variant="light" onClick={onLogoClick} clickable={true} />
      </div>
      <h1 className="top-artists-title">Your top artists</h1>
      <div className="artists-list">
        {artistsData.map((artist, index) => (
          <div 
            key={index} 
            className={`artist-item ${isActive ? 'animate' : ''}`}
            style={{ animationDelay: `${0.3 + index * 0.15}s` }}
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

// Screen 11: Summary
const Screen11 = ({ isActive }) => {
  const totalMinutes = Math.round(minutesData.minutes);
  const formattedMinutes = totalMinutes.toLocaleString();
  
  return (
    <div className="screen screen-11">
      <div className="summary-year-text">2026</div>
      <div className="summary-content">
        <div className="summary-image-container">
          <img src={jhusImg} alt="J Hus" className={`summary-main-image ${isActive ? 'animate' : ''}`} />
        </div>
        <div className="summary-lists">
          <div className="summary-column">
            <h3 className="summary-label">Top Artists</h3>
            <ul className="summary-items">
              {artistsData.map((artist, index) => (
                <li 
                  key={index} 
                  className={`summary-item ${isActive ? 'animate' : ''}`}
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  {artist.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="summary-column">
            <h3 className="summary-label">Top Songs</h3>
            <ul className="summary-items">
              {songsData.map((song, index) => (
                <li 
                  key={index} 
                  className={`summary-item ${isActive ? 'animate' : ''}`}
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
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
  const [animationStarted, setAnimationStarted] = React.useState(false);
  const [currentScreen, setCurrentScreen] = React.useState(1);
  const [transitioning, setTransitioning] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setAnimationStarted(true), 100);
  }, []);

  const handleLogoClick = () => {
    if (!transitioning && currentScreen < 11) {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentScreen(currentScreen + 1);
        setTransitioning(false);
      }, 800);
    }
  };

  return (
    <div className={`wrapped-container ${animationStarted ? 'animate' : ''} ${transitioning ? 'transitioning' : ''}`}>
      <div className={`screens-wrapper screen-${currentScreen}`}>
        <Screen1 onLogoClick={handleLogoClick} />
        <Screen2 onLogoClick={handleLogoClick} />
        <Screen3 onLogoClick={handleLogoClick} />
        <Screen4 onLogoClick={handleLogoClick} isActive={currentScreen === 4} />
        <Screen5 onLogoClick={handleLogoClick} />
        <Screen6 onLogoClick={handleLogoClick} isActive={currentScreen === 6} />
        <Screen7 onLogoClick={handleLogoClick} isActive={currentScreen === 7} />
        <Screen8 onLogoClick={handleLogoClick} isActive={currentScreen === 8} />
        <Screen9 onLogoClick={handleLogoClick} />
        <Screen10 onLogoClick={handleLogoClick} isActive={currentScreen === 10} />
        <Screen11 isActive={currentScreen === 11} />
      </div>
    </div>
  );
}

export default App;