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
// ─── Command definitions ───────────────────────────────────────────────────
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
      { text: 'projects     → my projects', cls: '' },
      { text: 'contact      → how to reach me', cls: '' },
      { text: 'cv           → open CV modal', cls: '' },
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
      { text: 'Goal: Network Engineer / Cybersecurity / DevOps.', cls: '' },
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
      { text: 'Wrocławska Akademia Biznesu · 2022 – present', cls: 'dim' },
      { text: '', cls: '' },
      { text: 'IT Technician', cls: 'magenta' },
      { text: 'ZSP "Energetyk" Wałbrzych · 2018 – 2022', cls: 'dim' },
    ],
  }),

  projects: () => ({
    type: 'list',
    lines: [
      { text: '// PROJECTS // INDEXED', cls: 'cyan' },
      { text: '─────────────────────────────────────', cls: 'dim' },
      { text: '[01] Portfolio Site', cls: 'cyan' },
      { text: '     React · Three.js · Vite · Vercel', cls: 'dim' },
      { text: '     → damianfilipiak.vercel.app', cls: '' },
      { text: '', cls: '' },
      { text: '[02] Net Toolkit', cls: 'magenta' },
      { text: '     React · IP/CIDR · Subnetting · VLAN · GeoIP', cls: 'dim' },
      { text: '     → github.com/damianfilipiak', cls: '' },
      { text: '', cls: '' },
      { text: '[03] Homelab', cls: 'cyan' },
      { text: '     pfSense · VMware · Docker · k3s · Grafana', cls: 'dim' },
      { text: '     → private infrastructure project', cls: '' },
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
      { text: 'ROLE    → Junior IT Specialist', cls: '' },
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
      { text: 'drwxr-xr-x  projects/', cls: 'cyan' },
      { text: 'drwxr-xr-x  education/', cls: 'cyan' },
      { text: 'drwxr-xr-x  contact/', cls: 'cyan' },
      { text: 'drwx------  secrets/    [PERMISSION DENIED]', cls: 'magenta' },
    ],
  }),

  cv: () => ({ type: 'cv' }),

  // ── Easter eggs ────────────────────────────────────────────────────────

  'sudo rm -rf /': () => ({
    type: 'list',
    lines: [
      { text: 'sudo: nice try.', cls: 'magenta' },
      { text: 'this system is not yours.', cls: 'dim' },
    ],
  }),

  'sudo rm -rf': () => ({
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

  snowboard: () => ({
    type: 'list',
    lines: [
      { text: '        o          ', cls: 'cyan' },
      { text: '       /|\\         ', cls: 'cyan' },
      { text: '       / \\         ', cls: 'cyan' },
      { text: '    __/___\\__      ', cls: 'magenta' },
      { text: '   /____________\\  ', cls: 'magenta' },
      { text: '', cls: '' },
      { text: '// shredding since forever', cls: 'dim' },
    ],
  }),

  hack: () => ({ type: 'hack' }),

  'hire me': () => ({ type: 'hire' }),
  hireme: () => ({ type: 'hire' }),

  'cat secrets': () => ({
    type: 'list',
    lines: [
      { text: 'cat: secrets: Permission denied', cls: 'magenta' },
      { text: '', cls: '' },
      { text: '// hint: try the konami code', cls: 'dim' },
    ],
  }),

  'cat readme': () => ({
    type: 'list',
    lines: [
      { text: '# DAMIAN_FILIPIAK', cls: 'cyan' },
      { text: 'Junior IT Specialist turned Web Developer.', cls: '' },
      { text: 'Built this portfolio with React + Three.js.', cls: '' },
      { text: 'Deployed on Vercel. Security rating: A.', cls: '' },
      { text: '', cls: '' },
      { text: '> type `help` for available commands', cls: 'dim' },
    ],
  }),

  exit: () => ({ type: 'exit' }),
  quit: () => ({ type: 'exit' }),
  close: () => ({ type: 'exit' }),
  clear: () => ({ type: 'clear' }),
  cls: () => ({ type: 'clear' }),

  '': () => ({ type: 'empty' }),
};

// ─── Matrix rain effect ────────────────────────────────────────────────────
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

// ─── Hack animation ────────────────────────────────────────────────────────
const HACK_LINES = [
  'Initializing breach sequence...',
  'Scanning target: damianfilipiak.vercel.app',
  'Port scan: 22 CLOSED · 80 OPEN · 443 OPEN',
  'Attempting exploit CVE-2024-XXXX...',
  'Access DENIED. Security rating: A',
  'Trying alternate vector...',
  'FIREWALL DETECTED. Aborting.',
  '> You cannot hack what you own.',
  '> Nice try though.',
];

function HackAnim({ onDone }) {
  const [lines, setLines] = useState([]);
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= HACK_LINES.length) { clearInterval(interval); setTimeout(onDone, 600); return; }
      setLines(prev => [...prev, HACK_LINES[i]]);
      i++;
    }, 320);
    return () => clearInterval(interval);
  }, [onDone]);
  return (
    <div>
      {lines.map((l, i) => (
        <div key={i} style={{ color: i >= 7 ? '#ff4466' : i >= 4 ? '#ffaa00' : '#00e5ff', fontSize: 12, lineHeight: 1.8 }}>{l}</div>
      ))}
    </div>
  );
}

// ─── Hire animation ────────────────────────────────────────────────────────
function HireAnim({ onDone }) {
  const [step, setStep] = useState(0);
  const steps = [
    { text: 'INITIATING HIRE_SEQUENCE...', cls: 'cyan' },
    { text: 'Checking qualifications... ✓', cls: '' },
    { text: 'Verifying portfolio... ✓', cls: '' },
    { text: 'Running background check... ✓', cls: '' },
    { text: 'Security clearance: A grade ✓', cls: '' },
    { text: '─────────────────────────────────────', cls: 'dim' },
    { text: '✓ CANDIDATE APPROVED', cls: 'cyan' },
    { text: '', cls: '' },
    { text: 'damian.filipiak02@gmail.com', cls: 'magenta' },
    { text: '+48 780 127 927', cls: 'magenta' },
  ];
  useEffect(() => {
    if (step >= steps.length) { setTimeout(onDone, 400); return; }
    const t = setTimeout(() => setStep(s => s + 1), 280);
    return () => clearTimeout(t);
  }, [step]);
  return (
    <div>
      {steps.slice(0, step).map((s, i) => (
        <div key={i} className={`t-${s.cls || 'default'}`} style={{ fontSize: 12, lineHeight: 1.9 }}>{s.text}</div>
      ))}
    </div>
  );
}

// ─── Main Terminal component ───────────────────────────────────────────────
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

  // Konami code
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

    // Add input line to history
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
      // Tab autocomplete
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
          {specialOutput === 'hack' && <HackAnim onDone={specialDone} />}
          {specialOutput === 'hire' && <HireAnim onDone={specialDone} />}

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
