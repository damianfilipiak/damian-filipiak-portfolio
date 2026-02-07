import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stage, Float } from '@react-three/drei';
import grimAudio from './grim.mp3';
import './App.css';

function Model() {
  const { scene } = useGLTF('/snowboard.glb'); 
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = width < 800; 
  const isTablet = width >= 800 && width <= 1300;

  let scale = 1.7;
  let position = [0, -2.1, 0]; 
  if (isMobile) {
    scale = 1.0;
    position = [0, -1.6, 0]; 
  } else if (isTablet) {
    scale = 1.3;
    position = [0, -1.8, 0]; 
  }

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <primitive 
        object={scene} 
        rotation={[0, Math.PI / 2, 0]} 
        scale={scale} 
        position={position} 
      />
    </Float>
  );
}

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [audio] = useState(new Audio(grimAudio));
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    audio.loop = true;
    audio.volume = 0.4;
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      audio.pause();
      window.removeEventListener('resize', handleResize);
    };
  }, [audio]);

  const toggleAudio = () => {
    if (isPlaying) audio.pause();
    else audio.play().catch(e => console.log("Audio Error:", e));
    setIsPlaying(!isPlaying);
  };

  const isMobile = width < 800;

  return (
    <div className="awge-v3-container">
      <div className="glitch-bg"></div>
      <div className="noise-overlay"></div>
      
      <div className="ui-frame">
        <header className="header">
          <div className="brand">CORE_v1.0 // DAMIAN_FILIPIAK</div>
          <div className="nav-group">
            <button onClick={() => setShowAbout(!showAbout)} className={showAbout ? 'active' : ''}>
              {showAbout ? '[ CLOSE ]' : '[ TECH_SPEC ]'}
            </button>
            <button className={`audio-btn ${isPlaying ? 'playing' : ''}`} onClick={toggleAudio}>
              {isPlaying ? '[ SOUND_ON ]' : '[ SOUND_OFF ]'}
            </button>
          </div>
        </header>

        <div className="canvas-container">
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 40 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={2.5} />
            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.8} contactShadow={false}>
                <Model />
              </Stage>-
              <OrbitControls 
                enableZoom={false} 
                enableRotate={!isMobile} 
                autoRotate={true} 
                autoRotateSpeed={0.8} 
              />
            </Suspense>
          </Canvas>
        </div>

        {showAbout && (
          <div className="terminal-overlay">
            <div className="bio-terminal">
              <div className="term-head">INTERNAL_LOGS // DAMIAN_FILIPIAK</div>
              <div className="term-body">
                <p className="cyan">> BACHELOR OF ENGINEERING IN COMPUTER SCIENCE - CYBERSECURITY AND COMPUTER NETWORKS - WROCŁAWSKA AKADEMIA BIZNESU (2022 - PRESENT) </p>
                <p>> JUNIOR IT SPECIALIST - FORVIA POLAND, WALBRZYCH (03.2025 - PRESENT)</p>
                <p className="magenta">> JUNIOR PROCESS ENGINEER (06.2023 - 03.2025)</p>
                
                <br />
                <p style={{color: '#fff', fontWeight: 'bold'}}>>> CORE_PASSIONS // INTERESTS_MODULE</p>
                <p className="cyan">> MUSIC</p>
                <p className="magenta">> WEB_ENGINEERING</p>
                <p className="cyan">> SNOWBOARDING</p>
                <p className="magenta">> FOOTBALL, COMPUTER_GAMES</p>
                
                <p className="blink">_</p>
              </div>
            </div>
          </div>
        )}    

        <div className="main-content">
          <section className="hero-info">
            <h1 className="title">DAMIAN<br/>FILIPIAK</h1>
            <p className="description">JUNIOR IT SPECIALIST</p>
          </section>

          <section className="contact-area">
            <div className="contact-links">
              <a href="https://github.com/damianfilipiak" target="_blank" rel="noreferrer">GITHUB</a>
              <a href="https://www.linkedin.com/in/damian-filipiak-556690246/" target="_blank" rel="noreferrer">LINKEDIN</a>
            </div>
  
            <form action="https://formspree.io/f/xeelqkrz" method="POST" className="mail-form">
            <input type="text" name="_gotcha" style={{ display: 'none' }} />
              <input type="email" name="email" placeholder="YOUR_EMAIL" required />
              <textarea name="message" placeholder="MESSAGE_CONTENT" required></textarea>
              <button type="submit">SEND_TRANSMISSION_></button>
            </form>
          </section>
        </div>

        <footer className="footer">© 2026 // <span className="highlight-white">[ DRAG_TO_ROTATE ]</span> // LOC: WAŁBRZYCH_PL</footer>
      </div>
    </div>
  );
}

export default App;