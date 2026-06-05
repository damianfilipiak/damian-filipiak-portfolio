import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stage, Float } from '@react-three/drei';
import grimAudio from './grim.mp3'; // "The Outcome" by Pixabay (https://pixabay.com/music/electronic-the-outcome-free-rap-beat-462680/)
import './App.css';
import { Analytics } from '@vercel/analytics/react';

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
  const [showCV, setShowCV] = useState(false);
  const [cvLang, setCvLang] = useState('EN'); 
  const [width, setWidth] = useState(window.innerWidth);
  
  const audioRef = useRef(new Audio(grimAudio)); 

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0.1;
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      audio.pause();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (isPlaying) audio.pause();
    else audio.play().catch(e => console.log("Audio Error:", e));
    setIsPlaying(!isPlaying);
  };

  const isMobile = width < 800;

  const currentPdfUrl = cvLang === 'EN' 
    ? "/Damian_Filipiak_Junior_Spec_IT_CV_EN.pdf" 
    : "/Damian Filipiak - Mlodszy Spec IT.pdf";

  const handlePrint = () => {
    const printWindow = window.open(currentPdfUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <div className="awge-v3-container">
      <div className="glitch-bg"></div>
      <div className="noise-overlay"></div>
      
      <div className="ui-frame">
        <header className="header">
          <div className="brand">CORE_v1.5 // DAMIAN_FILIPIAK</div>
          <div className="nav-group">
            <button onClick={() => {setShowAbout(!showAbout); setShowCV(false);}} className={showAbout ? 'active' : ''}>
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
              </Stage>
              <OrbitControls 
                enableZoom={false} 
                enableRotate={!isMobile} 
                autoRotate={true} 
                autoRotateSpeed={0.8} 
              />
            </Suspense>
          </Canvas>
        </div>

        {/* TECH SPEC POPUP */}
        {showAbout && (
          <div className="terminal-overlay">
            <div className="bio-terminal">
              <div className="term-head">INTERNAL_LOGS // DAMIAN_FILIPIAK // 22.04.2002</div>
              <div className="term-body">
                <br/>
                <p style={{color: '#fff', fontWeight: 'bold'}}>{`>> SYSTEM_PROMPT // USER_BIO`}</p>
                <p>{`> JUNIOR IT SPECIALIST WITH HANDS-ON EXPERIENCE IN MAINTAINING LOCAL PRODUCTION AND OFFICE INFRASTRUCTURE. ON A DAILY BASIS I ENSURE THE RELIABLE OPERATION OF SERVER SYSTEMS AND LAN/VLAN NETWORKS.`}</p>
                <p className="cyan">{`> CURRENTLY PURSUING A BACHELOR'S DEGREE WITH PLANS TO ADVANCE TO A MASTER'S PROGRAM. MY PRIMARY TARGET PATHS ARE NETWORK ENGINEERING, CYBERSECURITY, AND DEVOPS.`}</p>
                <p className="magenta">{`> AS A SIDE QUEST, I HIGHLY ENJOY ENGINEERING CREATIVE WEB EXPERIENCES LIKE THE ONE YOU ARE CURRENTLY BROWSING.`}</p>
                <br />

                <p style={{color: '#fff', fontWeight: 'bold'}}>{`>> USER_SCHOOL // EDUCATION`}</p>
                <p className="cyan">{`> BACHELOR OF ENGINEERING IN COMPUTER SCIENCE - CYBERSECURITY AND COMPUTER NETWORKS - WROCŁAWSKA AKADEMIA BIZNESU (2022 - PRESENT)`}</p>
                <p className="cyan">{`> ZESPÓŁ SZKÓŁ POLITECHNICZNYCH "ENERGETYK" WAŁBRZYCH (2018 - 2022) - IT TECHNICIAN`}</p>
                <br/>
                
                <p className="blink" style={{color: '#fff', fontWeight: 'bold'}}>{`>> WORK // WORK_EXPERIENCE`}</p>
                <p>{`> JUNIOR IT SPECIALIST - FORVIA POLAND, WALBRZYCH (03.2025 - PRESENT)`}</p>
                <p className="magenta">{`> JUNIOR PROCESS ENGINEER (06.2023 - 03.2025)`}</p>
                
                <br />
                <p className="blink" style={{color: '#fff', fontWeight: 'bold'}}>{`>> CURRENT_OPERATIONS // JUNIOR_IT_SPEC`}</p>
                <p className="cyan">{`> INFRA_MANAGEMENT:`} <span style={{color: '#ccc'}}>{`FRONT/BACK-OFFICE SUPPORT`}</span></p>
                <p className="magenta">{`> MONITORING:`} <span style={{color: '#ccc'}}>{`HYDRA, GRAFANA (CRIT/DOWN ALERTS, KPI)`}</span></p>
                <p className="cyan">{`> VIRTUAL_ENV:`} <span style={{color: '#ccc'}}>{`VMWARE VSPHERE, LENOVO XCLARITY, HA/FAILOVER`}</span></p>
                <p className="magenta">{`> NETWORK_ADMIN:`} <span style={{color: '#ccc'}}>{`LAN/VLAN, CISCO IE -> SIEMENS SCALANCE, NAT, KEPWARE`}</span></p>
                <p className="cyan">{`> IAM & BACKUP:`} <span style={{color: '#ccc'}}>{`ACTIVE DIRECTORY, SAP MII, COMMVAULT, TAPE LIBRARIES`}</span></p>

                <br />
                <p style={{color: '#fff', fontWeight: 'bold'}}>{`>> TECH_STACK // SKILLS_MODULE`}</p>
                <p className="cyan">{`> NETWORKING:`} <span style={{color: '#fff'}}>{`CISCO, SIEMENS SCALANCE, VLAN/NAT, PFSENSE`}</span></p>
                <p className="magenta">{`> SYSTEMS:`} <span style={{color: '#fff'}}>{`WINDOWS SERVER, AD, SAP MII, VMWARE, XCLARITY`}</span></p>
                <p className="cyan">{`> TOOLS:`} <span style={{color: '#fff'}}>{`GRAFANA, HYDRA, COMMVAULT, HTML/CSS/JS/REACT`}</span></p>

                <br />
                <p style={{color: '#fff', fontWeight: 'bold'}}>{`>> CORE_PASSIONS // INTERESTS_MODULE`}</p>
                <p className="magenta">{`> MUSIC, WEB_ENGINEERING, SNOWBOARDING, ESPORTS & FOOTBALL`}</p>
                
                <p className="blink">_</p>
              </div>
            </div>
          </div>
        )}

        {/* CV PDF POPUP */}
        {showCV && (
          <div className="terminal-overlay cv-overlay">
            <div className="bio-terminal cv-container">
              <div className="term-head cv-head">
                <span>// CURRICULUM_VITAE</span>
                <div className="cv-controls">
                  <button className={cvLang === 'EN' ? 'active' : ''} onClick={() => setCvLang('EN')}>[ EN ]</button>
                  <button className={cvLang === 'PL' ? 'active' : ''} onClick={() => setCvLang('PL')}>[ PL ]</button>
                  <button onClick={handlePrint}>[ PRINT ]</button>
                  <a href={currentPdfUrl} download className="dl-btn">[ DOWNLOAD ]</a>
                  <button onClick={() => setShowCV(false)}>[ CLOSE ]</button>
                </div>
              </div>

              <div className="term-body pdf-wrapper">
                <iframe 
                  src={`${currentPdfUrl}#view=FitH`} 
                  title="Damian Filipiak CV"
                  className="pdf-iframe"
                />
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
              <button className="cv-link-btn" onClick={() => {setShowCV(true); setShowAbout(false);}}>
                CV
              </button>
            </div>
  
            <form action="https://formspree.io/f/xeelqkrz" method="POST" className="mail-form">
              <input type="text" name="_gotcha" style={{ display: 'none' }} />
              <input type="email" name="email" placeholder="YOUR_EMAIL" required />
              <textarea name="message" placeholder="MESSAGE_CONTENT" required></textarea>
              <button type="submit">SEND_TRANSMISSION_></button>
            </form>
          </section>
        </div>

        <footer className="footer">DAMIAN FILIPIAK © 2026 // 
          <span className="highlight-white desktop-text"> [ DRAG_TO_ROTATE ] </span>
          <span className="highlight-white mobile-text"> [ AUTO_ROTATE ] </span> 
          // LOC: WAŁBRZYCH_PL
        </footer>
      </div>
      
      {/* VERCEL ANALYTICS COMPONENT */}
      <Analytics />
      
    </div>
  );
}

export default App;