export default function CatAvatar({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <ellipse cx="50" cy="55" rx="35" ry="32" fill="white" stroke="#333" strokeWidth="2"/>
      {/* Left ear */}
      <polygon points="20,30 12,5 35,22" fill="white" stroke="#333" strokeWidth="2"/>
      <polygon points="19,26 15,10 30,22" fill="#FFB6C1"/>
      {/* Right ear */}
      <polygon points="80,30 88,5 65,22" fill="white" stroke="#333" strokeWidth="2"/>
      <polygon points="81,26 85,10 70,22" fill="#FFB6C1"/>
      {/* Black patches */}
      <ellipse cx="30" cy="40" rx="12" ry="10" fill="#333" opacity="0.85"/>
      <ellipse cx="72" cy="38" rx="10" ry="9" fill="#333" opacity="0.85"/>
      <ellipse cx="50" cy="28" rx="8" ry="6" fill="#333" opacity="0.7"/>
      {/* Eyes */}
      <ellipse cx="37" cy="50" rx="6" ry="7" fill="#FFD700"/>
      <ellipse cx="63" cy="50" rx="6" ry="7" fill="#FFD700"/>
      <ellipse cx="37" cy="50" rx="3" ry="5" fill="#333"/>
      <ellipse cx="63" cy="50" rx="3" ry="5" fill="#333"/>
      <circle cx="35" cy="48" r="2" fill="white"/>
      <circle cx="61" cy="48" r="2" fill="white"/>
      {/* Nose */}
      <polygon points="50,58 47,62 53,62" fill="#FFB6C1"/>
      {/* Mouth */}
      <path d="M47,63 Q50,67 50,63" stroke="#333" strokeWidth="1.5" fill="none"/>
      <path d="M53,63 Q50,67 50,63" stroke="#333" strokeWidth="1.5" fill="none"/>
      {/* Whiskers */}
      <line x1="15" y1="55" x2="35" y2="58" stroke="#999" strokeWidth="1"/>
      <line x1="15" y1="60" x2="35" y2="62" stroke="#999" strokeWidth="1"/>
      <line x1="15" y1="65" x2="35" y2="65" stroke="#999" strokeWidth="1"/>
      <line x1="85" y1="55" x2="65" y2="58" stroke="#999" strokeWidth="1"/>
      <line x1="85" y1="60" x2="65" y2="62" stroke="#999" strokeWidth="1"/>
      <line x1="85" y1="65" x2="65" y2="65" stroke="#999" strokeWidth="1"/>
      {/* Blush */}
      <ellipse cx="28" cy="62" rx="6" ry="3" fill="#FFB6C1" opacity="0.4"/>
      <ellipse cx="72" cy="62" rx="6" ry="3" fill="#FFB6C1" opacity="0.4"/>
    </svg>
  );
}
