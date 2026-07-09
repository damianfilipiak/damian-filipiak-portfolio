import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Terminal.css';

function useCmdHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem('nettk_terminal_history');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (parsed.expires && Date.now() > parsed.expires) return [];
      return parsed.value || [];
    } catch { return []; }
  });

  const save = (val) => {
    try {
      localStorage.setItem('nettk_terminal_history', JSON.stringify({
        value: val,
        expires: Date.now() + 30 * 24 * 60 * 60 * 1000
      }));
    } catch {}
    setHistory(val);
  };

  return [history, save];
}
const COMMANDS = {
  help: () => ({
    type: 'list',
    lines: [
      { text: '// AVAILABLE COMMANDS', cls: 'cyan' },
      { text: '─────────────────────────────────────', cls: 'dim' },
      { text: 'about        → info about me', cls: '' },
      { text: 'skills       → tech stack', cls: '' },
      { text: 'experience   → work history', cls: '' },
      { text: 'education    → academic background', cls: '' },
      { text: 'contact      → how to reach me', cls: '' },
      { text: 'cv           → open CV modal', cls: '' },
      { text: 'hire me      → hire me', cls: '' },
      { text: 'whoami       → identify current user', cls: '' },
      { text: 'ping         → test connection', cls: '' },
      { text: 'ls           → list directories', cls: '' },
      { text: 'clear        → clear terminal', cls: '' },
      { text: '─────────────────────────────────────', cls: 'dim' },
      { text: '// try something unexpected...', cls: 'dim' },
    ],
  }),

  about: () => ({
    type: 'list',
    lines: [
      { text: '// INTERNAL_LOGS // DAMIAN_FILIPIAK', cls: 'cyan' },
      { text: '─────────────────────────────────────', cls: 'dim' },
      { text: 'Junior IT Specialist @ Forvia Poland', cls: '' },
      { text: 'Location: Wałbrzych, PL', cls: '' },
      { text: '', cls: '' },
      { text: 'I maintain local production & office IT infrastructure.', cls: '' },
      { text: 'Daily work: LAN/VLAN, VMware, AD, Commvault, Grafana.', cls: '' },
      { text: 'Goal: Network Engineer / DevOps.', cls: '' },
      { text: '', cls: '' },
      { text: 'Passions: music, snowboarding, web engineering,', cls: 'magenta' },
      { text: '          football, computer games.', cls: 'magenta' },
    ],
  }),

  skills: () => ({
    type: 'list',
    lines: [
      { text: '// TECH_STACK // LOADED', cls: 'cyan' },
      { text: '─────────────────────────────────────', cls: 'dim' },
      { text: 'NETWORKS     Cisco IOS · Siemens Scalance · VLAN', cls: 'cyan' },
      { text: '             NAT · DHCP · pfSense', cls: 'cyan' },
      { text: 'VIRTUALISE   VMware vSphere · Lenovo XClarity', cls: 'magenta' },
      { text: 'SYSTEMS      Windows Server · Active Directory · SAP MII', cls: '' },
      { text: 'MONITORING   Grafana · Hydra', cls: 'cyan' },
      { text: 'BACKUP       Commvault', cls: '' },
      { text: 'WEB          HTML · CSS · JavaScript · React · Vite', cls: 'magenta' },
      { text: 'CONTAINERS   Docker · Kubernetes (k3s)', cls: 'cyan' },
      { text: 'SECURITY     pfSense · AD RBAC · GPO · AGDLP', cls: 'magenta' },
    ],
  }),

  experience: () => ({
    type: 'list',
    lines: [
      { text: '// WORK_HISTORY', cls: 'cyan' },
      { text: '─────────────────────────────────────', cls: 'dim' },
      { text: 'Junior IT Specialist', cls: 'cyan' },
      { text: 'Forvia S.A. · March 2025 – present', cls: 'dim' },
      { text: '→ Local IT infrastructure management', cls: '' },
      { text: '→ Network/server monitoring (Hydra + Grafana)', cls: '' },
      { text: '→ VMware vSphere, Lenovo XClarity', cls: '' },
      { text: '→ LAN/VLAN migration: Cisco IE → Siemens Scalance', cls: '' },
      { text: '→ Active Directory, SAP MII, Commvault', cls: '' },
      { text: '', cls: '' },
      { text: 'Junior Process Engineer', cls: 'magenta' },
      { text: 'Forvia S.A. · June 2023 – March 2025', cls: 'dim' },
    ],
  }),

  education: () => ({
    type: 'list',
    lines: [
      { text: '// EDUCATION_MODULE', cls: 'cyan' },
      { text: '─────────────────────────────────────', cls: 'dim' },
      { text: 'B.ENG Computer Science', cls: 'cyan' },
      { text: 'Cybersecurity & Computer Networks', cls: '' },
      { text: 'Wrocławska Akademia Biznesu · 2022 – 07.2026', cls: 'dim' },
    ],
  }),

  contact: () => ({
    type: 'list',
    lines: [
      { text: '// CONTACT_MODULE // ONLINE', cls: 'cyan' },
      { text: '─────────────────────────────────────', cls: 'dim' },
      { text: '✉  damian.filipiak02@gmail.com', cls: '' },
      { text: '☎  +48 780 127 927', cls: '' },
      { text: '⌥  github.com/damianfilipiak', cls: 'cyan' },
      { text: '⌗  linkedin.com/in/damian-filipiak-556690246', cls: 'magenta' },
    ],
  }),

  whoami: () => ({
    type: 'list',
    lines: [
      { text: 'DAMIAN_FILIPIAK', cls: 'cyan' },
      { text: 'ROLE    → B. Eng Computer Science, Junior IT Specialist', cls: '' },
      { text: 'COMPANY → Forvia S.A.', cls: '' },
      { text: 'LOC     → Wałbrzych, PL', cls: '' },
      { text: 'STATUS  → open to opportunities', cls: 'magenta' },
    ],
  }),

  ping: () => ({
    type: 'list',
    lines: [
      { text: 'PING damianfilipiak.vercel.app', cls: 'dim' },
      { text: 'Reply: bytes=64 time=1ms TTL=64', cls: 'cyan' },
      { text: 'Reply: bytes=64 time=1ms TTL=64', cls: 'cyan' },
      { text: 'Reply: bytes=64 time=2ms TTL=64', cls: 'cyan' },
      { text: 'Reply: bytes=64 time=1ms TTL=64', cls: 'cyan' },
      { text: '─────────────────────────────────────', cls: 'dim' },
      { text: 'Packets: Sent=4 Received=4 Lost=0 (0% loss)', cls: '' },
      { text: 'min=1ms avg=1ms max=2ms', cls: 'magenta' },
      { text: '', cls: '' },
      { text: '// connection established. hire me.', cls: 'dim' },
    ],
  }),

  ls: () => ({
    type: 'list',
    lines: [
      { text: 'total 6 directories', cls: 'dim' },
      { text: 'drwxr-xr-x  skills/', cls: 'cyan' },
      { text: 'drwxr-xr-x  experience/', cls: 'cyan' },
      { text: 'drwxr-xr-x  education/', cls: 'cyan' },
      { text: 'drwxr-xr-x  contact/', cls: 'cyan' },
      { text: 'drwx------  secrets/    [PERMISSION DENIED]', cls: 'magenta' },
    ],
  }),

  cv: () => ({ type: 'cv' }),

  'sudo rm -rf /': () => ({
    type: 'list',
    lines: [
      { text: 'sudo: nice try.', cls: 'magenta' },
      { text: 'this system is not yours.', cls: 'dim' },
    ],
  }),

  'cd ..': () => ({
    type: 'list',
    lines: [{ text: "you can't escape. you're already home.", cls: 'magenta' }],
  }),

  'cd /': () => ({
    type: 'list',
    lines: [{ text: 'you are already at root.', cls: 'dim' }],
  }),

  pwd: () => ({
    type: 'list',
    lines: [{ text: '/home/damian/portfolio', cls: 'cyan' }],
  }),

  uname: () => ({
    type: 'list',
    lines: [{ text: 'CORE_v2.0 // DAMIAN_FILIPIAK_OS // x86_64', cls: 'cyan' }],
  }),

  matrix: () => ({ type: 'matrix' }),

  'hire me': () => ({ type: 'hire' }),
  hireme: () => ({ type: 'hire' }),

  exit: () => ({ type: 'exit' }),
  quit: () => ({ type: 'exit' }),
  close: () => ({ type: 'exit' }),
  clear: () => ({ type: 'clear' }),
  cls: () => ({ type: 'clear' }),

  '': () => ({ type: 'empty' }),
};

function MatrixRain({ onDone }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const cols = Math.floor(canvas.width / 14);
    const drops = Array(cols).fill(1);
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF';
    const interval = setInterval(() => {
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00e5ff';
      ctx.font = '13px monospace';
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * 14, y * 14);
        if (y * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    }, 40);
    const timeout = setTimeout(() => { clearInterval(interval); onDone(); }, 3000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [onDone]);
  return <canvas ref={canvasRef} style={{ width: '100%', height: '160px', display: 'block' }} />;
}

function HireProtocol({ onDone }) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  const handleKeyDown = async (e) => {
    if (e.key === 'Escape') {
      onDone();
      return;
    }
    
    if (e.key === 'Enter') {
      if (step === 'email') {
        if (!email.includes('@')) {
          setStatus('Invalid email format. Try again.');
          return;
        }
        setStatus('');
        setStep('message');
      } else if (step === 'message') {
        if (message.trim().length < 2) return;
        setStep('sending');
        
        try {
          const res = await fetch('https://formspree.io/f/xeelqkrz', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ 
              email: email, 
              message: message,
              _gotcha: '',
              _subject: 'Wiadomość z Terminala (Hire Me)' 
            })
          });
          
          if (res.ok) {
            setStatus('Transmission successful. I will contact you soon.');
          } else {
            setStatus('Transmission failed. Server rejected the request.');
          }
        } catch (error) {
          setStatus('Network error. Transmission failed.');
        }
        
        setStep('done');
        setTimeout(() => onDone(), 3000);
      }
    }
  };

  return (
    <div className="term-hire-module">
      <div className="term-line" style={{ color: '#ff00f7' }}>// INITIATING SECURE HIRE PROTOCOL...</div>
      <div className="term-line dim">Press ESC to abort.</div>
      <br />
    
      {step !== 'email' && (
        <div className="term-inputline">
          <span className="term-prompt" style={{ color: '#00e5ff' }}>recruiter_email:~$</span>
          <span className="term-inputecho">{email}</span>
        </div>
      )}

      {step === 'email' && (
        <div className="term-inputline">
          <span className="term-prompt" style={{ color: '#00e5ff' }}>enter_your_email:~$</span>
          <input
            ref={inputRef}
            className="term-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
          />
          <span className="term-cursor" />
        </div>
      )}

      {(step === 'sending' || step === 'done') && (
        <div className="term-inputline">
          <span className="term-prompt" style={{ color: '#00e5ff' }}>message_content:~$</span>
          <span className="term-inputecho">{message}</span>
        </div>
      )}

      {step === 'message' && (
        <div className="term-inputline">
          <span className="term-prompt" style={{ color: '#00e5ff' }}>message_content:~$</span>
          <input
            ref={inputRef}
            className="term-input"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
          />
          <span className="term-cursor" />
        </div>
      )}

      {status && <div className="term-line" style={{ color: step === 'done' ? '#00e5ff' : '#ff4466' }}>{status}</div>}
      {step === 'sending' && <div className="term-line" style={{ color: '#ff00f7' }}>Encrypting and routing package...</div>}
    </div>
  );
}

export default function Terminal({ onClose, onOpenCV }) {
  const [history, setHistory] = useState([
    { type: 'output', lines: [
      { text: 'CORE_v2.0 // DAMIAN_FILIPIAK_TERMINAL', cls: 'cyan' },
      { text: 'Type `help` for available commands.', cls: 'dim' },
      { text: '─────────────────────────────────────', cls: 'dim' },
    ]},
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useCmdHistory();
  const [cmdIndex, setCmdIndex] = useState(-1);
  const [specialOutput, setSpecialOutput] = useState(null);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);


  const konamiRef = useRef([]);
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

  useEffect(() => {
    const handler = (e) => {
      konamiRef.current = [...konamiRef.current, e.key].slice(-10);
      if (konamiRef.current.join(',') === KONAMI.join(',')) {
        setHistory(prev => [...prev,
          { type: 'input', text: '// KONAMI CODE DETECTED' },
          { type: 'output', lines: [
            { text: '🎮 CHEAT CODE ACTIVATED', cls: 'cyan' },
            { text: '', cls: '' },
            { text: '↑↑↓↓←→←→BA', cls: 'magenta' },
            { text: '', cls: '' },
            { text: 'You found the secret.', cls: '' },
            { text: 'There is no prize. Only respect.', cls: 'dim' },
            { text: '', cls: '' },
            { text: '// now go hire me', cls: 'magenta' },
          ]},
        ]);
        konamiRef.current = [];
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
  if (!specialOutput) return;
  const interval = setInterval(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, 300);
  return () => clearInterval(interval);
}, [specialOutput]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleClose = useCallback(() => { onClose(); }, [onClose]);

  const runCommand = useCallback((raw) => {
    const cmd = raw.trim().toLowerCase();
    setCmdHistory(prev => cmd ? [raw, ...prev].slice(0, 50) : prev);
    setCmdIndex(-1);

    setHistory(prev => [...prev, { type: 'input', text: raw || ' ' }]);

    if (!cmd) return;

    const handler = COMMANDS[cmd];

    if (!handler) {
      setHistory(prev => [...prev, {
        type: 'output',
        lines: [{ text: `command not found: ${cmd}. Type \`help\`.`, cls: 'err' }],
      }]);
      return;
    }

    const result = handler();

    if (result.type === 'exit') {
      handleClose();
      return;
    }

    if (result.type === 'cv') {
      onOpenCV();
      setHistory(prev => [...prev, {
        type: 'output',
        lines: [{ text: '// opening CV_MODULE...', cls: 'cyan' }],
      }]);
      return;
    }

    if (result.type === 'clear') {
       setHistory([]);
      return;
    }

    if (result.type === 'empty') return;

    if (result.type === 'matrix' || result.type === 'hack' || result.type === 'hire') {
      setSpecialOutput(result.type);
      return;
    }

    setHistory(prev => [...prev, { type: 'output', lines: result.lines }]);
  }, [handleClose, onOpenCV]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      runCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = Math.min(cmdIndex + 1, cmdHistory.length - 1);
      setCmdIndex(newIndex);
      setInput(cmdHistory[newIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = Math.max(cmdIndex - 1, -1);
      setCmdIndex(newIndex);
      setInput(cmdIndex <= 0 ? '' : cmdHistory[newIndex] || '');
    } else if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const partial = input.toLowerCase();
      const match = Object.keys(COMMANDS).find(k => k.startsWith(partial) && k !== partial && k !== '');
      if (match) setInput(match);
    }
  };

  const specialDone = useCallback(() => {
    setSpecialOutput(null);
    setHistory(prev => [...prev, {
      type: 'output',
      lines: [{ text: '// sequence complete', cls: 'dim' }],
    }]);
    inputRef.current?.focus();
  }, []);

  const clsMap = { cyan: '#00e5ff', magenta: '#ff00f7', dim: '#444', err: '#ff4466', default: '#d8d8d8', '': '#d8d8d8' };

  return (
    <div className="term-backdrop" onClick={handleClose}>
      <div className="term-window" onClick={e => e.stopPropagation()}>

        {/* Title bar */}
        <div className="term-titlebar">
          <span className="term-title">CONSOLE // DAMIAN_FILIPIAK_OS</span>
          <div className="term-titlebar-right">
            <span className="term-hint">ESC to close · TAB to autocomplete · ↑↓ history</span>
            <button className="term-closebtn" onClick={handleClose}>[ CLOSE ]</button>
          </div>
        </div>

        {/* Output area */}
        <div className="term-output" onClick={() => inputRef.current?.focus()}>
          {history.map((entry, i) => (
            <div key={i}>
              {entry.type === 'input' && (
                <div className="term-inputline">
                  <span className="term-prompt">damian@portfolio:~$</span>
                  <span className="term-inputecho">{entry.text}</span>
                </div>
              )}
              {entry.type === 'output' && entry.lines.map((line, j) => (
                <div key={j} className="term-line" style={{ color: clsMap[line.cls] || '#d8d8d8' }}>
                  {line.text || '\u00A0'}
                </div>
              ))}
            </div>
          ))}

          {/* Special animations */}
          {specialOutput === 'matrix' && <MatrixRain onDone={specialDone} />}
          {specialOutput === 'hire' && <HireProtocol onDone={specialDone} />}

          {/* Input line */}
          {!specialOutput && (
            <div className="term-inputline">
              <span className="term-prompt">damian@portfolio:~$</span>
              <input
                ref={inputRef}
                className="term-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                aria-label="Terminal input"
              />
              <span className="term-cursor" />
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
