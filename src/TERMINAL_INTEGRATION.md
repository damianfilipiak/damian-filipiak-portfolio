# Jak podpiąć Terminal do App.jsx

## 1. Skopiuj pliki
Wrzuć `Terminal.jsx` i `Terminal.css` do folderu `src/`

## 2. Dodaj import na górze App.jsx
```jsx
import Terminal from './Terminal';
```

## 3. Dodaj stan (obok istniejących useState)
```jsx
const [showTerminal, setShowTerminal] = useState(false);
```

## 4. Dodaj przycisk w headerze (obok TECH_SPEC i SOUND_OFF)
```jsx
<div className="nav-group">
  <button onClick={() => setShowTerminal(!showTerminal)} className={showTerminal ? 'active' : ''}>
    [ CONSOLE ]
  </button>
  <button onClick={() => setShowAbout(!showAbout)} className={showAbout ? 'active' : ''}>
    {showAbout ? '[ CLOSE ]' : '[ TECH_SPEC ]'}
  </button>
  <button className={`audio-btn ${isPlaying ? 'playing' : ''}`} onClick={toggleAudio}>
    {isPlaying ? '[ SOUND_ON ]' : '[ SOUND_OFF ]'}
  </button>
</div>
```

## 5. Dodaj komponent Terminal w JSX (przed zamknięciem głównego diva)
```jsx
{showTerminal && (
  <Terminal
    onClose={() => setShowTerminal(false)}
    onOpenCV={() => { setShowCV(true); setShowTerminal(false); }}
  />
)}
```

## 6. Gotowe — wrzuć na GitHub i Vercel zadeploy automatycznie
