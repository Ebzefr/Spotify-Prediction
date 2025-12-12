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
const minutesData = { minutes: 16415.10686326418 };

const songsData = [
  { track_name: "Peckham" },
  { track_name: "Lady of Neptune" },
  { track_name: "Like to Party" },
  { track_name: "Tous les jours" },
  { track_name: "Recognise" }
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

// Small Checkerboard
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

// Flipping Circles
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

// Count up hook
const useCountUp = (end, duration = 2500, active = false) => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
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

// Screens
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

const Screen4 = ({ isActive }) => {
  const total = Math.round(minutesData.minutes);
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

const Screen6 = ({ isActive }) => (
  <div className="screen screen-6">
    <div className={`logo-wrap small ${isActive ? 'animate' : ''}`}><SpotifyLogo size="small" variant="light" /></div>
    <h1 className={`section-title white-bg ${isActive ? 'animate' : ''}`}>Your top songs</h1>
    <div className="list">
      {topSongs.map((s, i) => (
        <div key={i} className={`list-item ${isActive ? 'animate' : ''}`} style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
          <span className="rank">{i + 1}</span>
          <img src={s.image} alt={s.track_name} />
          <div className="info"><h3>{s.track_name}</h3><p>{s.artist}</p></div>
        </div>
      ))}
    </div>
    <SmallCheckerboard position="bottom-right" />
  </div>
);

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

const Screen8 = ({ isActive }) => (
  <div className="screen screen-8">
    <div className={`logo-wrap small ${isActive ? 'animate' : ''}`}><SpotifyLogo size="small" /></div>
    <FlippingCirclesRow isActive={isActive} />
    <h1 className={`section-title yellow-bg ${isActive ? 'animate' : ''}`}>Your top albums</h1>
    <div className="albums-grid">
      {albumsData.slice(0, 4).map((a, i) => (
        <div key={i} className={`album-img ${isActive ? 'animate' : ''}`} style={{ animationDelay: `${0.2 + i * 0.12}s` }}>
          <img src={a.image} alt={a.name} /><span>{i + 1}</span>
        </div>
      ))}
    </div>
    <div className="albums-text">
      <div className="col">
        {[0, 2].map(i => (
          <div key={i} className={`album-item ${isActive ? 'animate' : ''}`} style={{ animationDelay: `${0.7 + i * 0.1}s` }}>
            <span className="rank">{i + 1}</span><div><h3>{albumsData[i].name}</h3><p>{albumsData[i].artist}</p></div>
          </div>
        ))}
      </div>
      <div className="col">
        {[1, 3].map(i => (
          <div key={i} className={`album-item ${isActive ? 'animate' : ''}`} style={{ animationDelay: `${0.75 + i * 0.1}s` }}>
            <span className="rank">{i + 1}</span><div><h3>{albumsData[i].name}</h3><p>{albumsData[i].artist}</p></div>
          </div>
        ))}
      </div>
    </div>
    <div className={`album-item center ${isActive ? 'animate' : ''}`} style={{ animationDelay: '1s' }}>
      <span className="rank">5</span><div><h3>{albumsData[4].name}</h3><p>{albumsData[4].artist}</p></div>
    </div>
  </div>
);

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

const Screen10 = ({ isActive }) => (
  <div className="screen screen-10">
    <div className={`logo-wrap small ${isActive ? 'animate' : ''}`}><SpotifyLogo size="small" variant="light" /></div>
    <h1 className={`section-title white-bg ${isActive ? 'animate' : ''}`}>Your top artists</h1>
    <div className="list">
      {artistsData.map((a, i) => (
        <div key={i} className={`list-item ${isActive ? 'animate' : ''}`} style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
          <span className="rank">{i + 1}</span>
          <img src={a.image} alt={a.name} />
          <h3 className="artist-name-tag">{a.name}</h3>
        </div>
      ))}
    </div>
    <WhiteSwoosh />
    <SmallCheckerboard position="top-left" />
    <SmallCheckerboard position="bottom-right" />
  </div>
);

const Screen11 = ({ isActive }) => {
  const total = Math.round(minutesData.minutes);
  return (
    <div className="screen screen-11">
      <div className={`big-year ${isActive ? 'animate' : ''}`}>2026</div>
      <div className="summary">
        <div className={`main-img ${isActive ? 'animate' : ''}`}><img src={jhusImg} alt="J Hus" /></div>
        <div className="cols">
          <div className="col">
            <h3 className={isActive ? 'animate' : ''}>Top Artists</h3>
            <ul>{artistsData.map((a, i) => <li key={i} className={isActive ? 'animate' : ''} style={{ animationDelay: `${0.3 + i * 0.06}s` }}>{a.name}</li>)}</ul>
          </div>
          <div className="col">
            <h3 className={isActive ? 'animate' : ''}>Top Songs</h3>
            <ul>{songsData.map((s, i) => <li key={i} className={isActive ? 'animate' : ''} style={{ animationDelay: `${0.3 + i * 0.06}s` }}>{s.track_name}</li>)}</ul>
          </div>
        </div>
        <div className={`final-mins ${isActive ? 'animate' : ''}`}>
          <p>Minutes Listened</p>
          <h2>{total.toLocaleString()}</h2>
        </div>
      </div>
      <SummaryLines />
      <SmallCheckerboard position="top-right" />
    </div>
  );
};

function App() {
  const [screen, setScreen] = React.useState(1);
  const [touchY, setTouchY] = React.useState(null);
  const [locked, setLocked] = React.useState(false);
  const total = 11;

  const go = (dir) => {
    if (locked) return;
    const next = screen + dir;
    if (next < 1 || next > total) return;
    setLocked(true);
    setScreen(next);
    setTimeout(() => setLocked(false), 700);
  };

  return (
    <div className="app" onTouchStart={e => setTouchY(e.touches[0].clientY)} onTouchEnd={e => {
      if (touchY === null) return;
      const diff = touchY - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
      setTouchY(null);
    }} onWheel={e => { if (Math.abs(e.deltaY) > 30) go(e.deltaY > 0 ? 1 : -1); }}>
      <div className={`wrapper s${screen}`}>
        <Screen1 isActive={screen === 1} />
        <Screen2 isActive={screen === 2} />
        <Screen3 isActive={screen === 3} />
        <Screen4 isActive={screen === 4} />
        <Screen5 isActive={screen === 5} />
        <Screen6 isActive={screen === 6} />
        <Screen7 isActive={screen === 7} />
        <Screen8 isActive={screen === 8} />
        <Screen9 isActive={screen === 9} />
        <Screen10 isActive={screen === 10} />
        <Screen11 isActive={screen === 11} />
      </div>
    </div>
  );
}

export default App;