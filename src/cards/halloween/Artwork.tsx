import { L } from 'locon/react';
import { useId } from 'react';
import type { HalloweenCharacter } from './model';

export function Bat({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 120 64" fill="none" aria-hidden="true"><path d="M60 22 52 10l-2 15C35 9 15 16 2 3c1 22 8 38 23 49 2-15 14-15 21-4 4-9 10-8 14 13 4-21 10-22 14-13 7-11 19-11 21 4 15-11 22-27 23-49-13 13-33 6-48 22l-2-15-8 12Z" fill="currentColor" /></svg>;
}

export function Invitation() {
  return (
    <svg className="invitation-art" viewBox="0 0 640 330" fill="none" aria-hidden="true">
      <ellipse cx="326" cy="291" rx="158" ry="14" fill="#20231e" opacity=".13" />
      <g className="ticket-float" data-float>
        <g transform="rotate(-9 320 165)">
          <path d="M153 63h336v75a19 19 0 0 0 0 38v76H153v-76a19 19 0 0 0 0-38V63Z" fill="#242820" stroke="#242820" strokeWidth="3" transform="translate(9 10)" />
          <path d="M153 63h336v75a19 19 0 0 0 0 38v76H153v-76a19 19 0 0 0 0-38V63Z" fill="#fcf9e9" stroke="#242820" strokeWidth="3" />
          <path d="M409 65v184" stroke="#9b9e8d" strokeWidth="2" strokeDasharray="5 7" />
          <text x="180" y="97" fill="#242820" fontSize="11" fontFamily="monospace" letterSpacing="3"><L>EINMAL GÄNSEHAUT, BITTE.</L></text>
          <text x="177" y="154" fill="#242820" fontSize="49" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="-2"><L>DU BIST</L></text>
          <text x="177" y="204" fill="#fa6036" fontSize="49" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="-2"><L>DRAN.</L></text>
          <path d="M180 226h197" stroke="#242820" strokeWidth="2" />
          <text x="437" y="218" transform="rotate(-90 437 218)" fill="#242820" fontSize="19" fontWeight="800" fontFamily="monospace" letterSpacing="4">31 / 10</text>
          <path d="M462 91v124m5-124v124m6-124v124" stroke="#242820" strokeWidth="2" />
        </g>
        <path d="m138 91-17-18m14 34-29-6m390 127 24 9m-27-28 19-7" stroke="#242820" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="invitation-bat" fill="#242820"><path d="m129 223-7-10-1 12c-14-8-27-3-40-15 2 19 12 32 24 37 1-10 12-13 18-5 4-8 9-7 13 6 3-14 10-16 16-9 3-11 15-9 22-3-2-18-13-26-25-23l-9 9-3-11-8 12Z" /></g>
      <circle cx="497" cy="71" r="29" fill="#fa6036" stroke="#242820" strokeWidth="2" /><path d="m484 68 6-7 6 7m4 1 6-7 6 7m-27 7q13 16 25-1" stroke="#242820" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function HauntedDoor() {
  return (
    <span className="haunted-set" aria-hidden="true">
      <svg className="night-scenery" viewBox="0 0 640 350" fill="none">
        <circle cx="455" cy="78" r="55" fill="#e6ee83" /><circle cx="475" cy="61" r="48" fill="#253c39" />
        <path d="M0 289q90-37 165-8t166-4q110-42 309 12v61H0Z" fill="#182c2b" />
        <path d="m53 295 9-162-31-50 34 28 9-67 8 83 39-39-34 65 7 142M548 298l14-150-29-42 35 23 22-60-7 83 38-18-42 36 3 128" stroke="#142725" strokeWidth="12" strokeLinejoin="round" />
        <path d="M0 325q130-30 260-5t380-8v38H0Z" fill="#122422" />
        <g fill="#d1e18e"><circle cx="90" cy="42" r="1.6" /><circle cx="173" cy="88" r="1.4" /><circle cx="526" cy="35" r="1.5" /><circle cx="386" cy="39" r="1.3" /></g>
      </svg>
      <span className="house-body"><span className="house-roof" /><span className="house-window house-window--left" /><span className="house-window house-window--right" />
        <span className="door-jamb">
          <span className="door-portal"><span className="portal-eyes" /></span>
          <span className="door-panel" data-door-panel>
            <span className="door-top-panel"><span className="door-number">13</span></span>
            <span className="door-bottom-panel" />
            <span className="door-knocker" data-knocker />
            <span className="door-handle" />
          </span>
        </span>
        <span className="doorstep" />
      </span>
      <span className="set-pumpkin set-pumpkin--left"><span /></span><span className="set-pumpkin set-pumpkin--right"><span /></span>
      <span className="set-fog set-fog--back" /><span className="set-fog" />
      <Bat className="set-bat set-bat--one" /><Bat className="set-bat set-bat--two" />
    </span>
  );
}

export function CharacterArt({ character, small = false }: { character: HalloweenCharacter; small?: boolean }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={small ? 'character-art character-art--small' : 'character-art'} viewBox="0 0 360 310" fill="none" aria-hidden="true" data-character={character}>
      <defs>
        <linearGradient id={`${id}-pumpkin`} x1="95" y1="100" x2="244" y2="260" gradientUnits="userSpaceOnUse"><stop stopColor="#ff9a32" /><stop offset="1" stopColor="#ec4c1d" /></linearGradient>
        <linearGradient id={`${id}-ghost`} x1="124" y1="90" x2="255" y2="253" gradientUnits="userSpaceOnUse"><stop stopColor="#fffef2" /><stop offset="1" stopColor="#c9d5bc" /></linearGradient>
      </defs>
      {!small && <ellipse className="monster-shadow" cx="180" cy="285" rx="87" ry="11" fill="#20231e" opacity=".17" />}
      <g data-monster data-float>
        {character === 'ghost' && <>
          <path className="ghost-arm ghost-arm--left" d="M113 155c-28-32-62-23-44 1l38 35" fill="#f1f1de" stroke="#263528" strokeWidth="4" strokeLinejoin="round" />
          <path className="ghost-arm ghost-arm--right" d="M247 155c28-32 62-23 44 1l-38 35" fill="#dce3cd" stroke="#263528" strokeWidth="4" strokeLinejoin="round" />
          <path d="M101 152c0-108 158-108 158 0v103l-27-18-26 24-26-19-26 19-26-24-27 18Z" fill={`url(#${id}-ghost)`} stroke="#263528" strokeWidth="4" strokeLinejoin="round" />
          <path d="M235 105c17 37 13 99-8 145l5-13 27 18V152c0-23-8-40-24-47Z" fill="#a5b69b" opacity=".4" />
          <g data-eyes><path d="m132 144 30 10-11 19c-21 6-31-6-19-29Zm96 0-30 10 11 19c21 6 31-6 19-29Z" fill="#263528" /><circle cx="149" cy="158" r="5" fill="#e6ee83" /><circle cx="211" cy="158" r="5" fill="#e6ee83" /></g>
          <path d="M163 191q17-16 34 0l-3 24c-7 8-21 8-28 0Z" fill="#263528" /><path d="m170 188 4 10 6-13 6 13 4-10" fill="#fffef2" />
          <path d="M145 91q22-18 47-9" stroke="#fffef2" strokeWidth="7" strokeLinecap="round" opacity=".7" />
        </>}
        {character === 'pumpkin' && <>
          <path d="M177 108c-9-22-4-43 16-54l15 16c-15 5-21 18-17 34" fill="#4b653a" stroke="#263528" strokeWidth="4" /><path d="M191 94c10-25 38-29 54-17-9 21-32 26-54 17Z" fill="#82934b" stroke="#263528" strokeWidth="3" />
          <ellipse cx="180" cy="186" rx="103" ry="82" fill={`url(#${id}-pumpkin)`} stroke="#713a1e" strokeWidth="4" />
          <ellipse cx="180" cy="186" rx="72" ry="81" stroke="#b7471c" strokeWidth="3" /><ellipse cx="180" cy="186" rx="35" ry="81" stroke="#b7471c" strokeWidth="3" />
          <g data-eyes><path d="m117 169 31-29 18 37Zm78 8 18-37 31 29Z" fill="#253426" stroke="#713a1e" strokeWidth="3" /><path d="m131 164 14-13 9 18Zm76 5 9-18 14 13Z" fill="#e6ee83" /></g>
          <path d="M118 197q62 65 124 0l-26 10-8-10-16 19-12-14-12 14-16-19-8 10Z" fill="#253426" stroke="#713a1e" strokeWidth="3" strokeLinejoin="round" />
          <path d="m139 219 9 8 7-9 13 17 12-10 12 10 13-17 7 9 9-8q-41 40-82 0Z" fill="#e6ee83" />
          <path d="M108 142q8-15 22-21" stroke="#ffc06b" strokeWidth="6" strokeLinecap="round" />
        </>}
        {character === 'vampire' && <>
          <path className="vampire-cape" d="m134 160-55 114 57-19 44 28 44-28 57 19-55-114" fill="#ab3429" stroke="#292e23" strokeWidth="4" strokeLinejoin="round" />
          <path d="m143 167-21 82 58 34 58-34-21-82" fill="#303a2c" stroke="#292e23" strokeWidth="3" />
          <path d="m124 150-20-31 36 5m96 26 20-31-36 5" fill="#d1deaf" stroke="#292e23" strokeWidth="3" />
          <path d="M122 113c0-72 116-72 116 0v49c0 71-116 71-116 0Z" fill="#e5eacb" stroke="#292e23" strokeWidth="4" />
          <path d="M118 128c-14-96 136-96 124 0l-39-22-23 27-23-27Z" fill="#263528" />
          <path d="M123 162q-8 31 21 42m92-42q8 31-21 42" stroke="#adc18d" strokeWidth="6" />
          <g data-eyes><path d="m139 151 24 5m58-5-24 5" stroke="#263528" strokeWidth="7" strokeLinecap="round" /><circle cx="153" cy="159" r="4" fill="#bf482e" /><circle cx="207" cy="159" r="4" fill="#bf482e" /></g>
          <path d="M157 183q23 24 46 0" fill="#263528" stroke="#263528" strokeWidth="3" /><path d="m162 184 8 17 7-12m6 0 7 12 8-17" fill="#fffef0" />
          <path d="m180 233-15-9v18l15-9 15 9v-18Z" fill="#d95732" /><circle cx="180" cy="252" r="3" fill="#e6ee83" />
        </>}
      </g>
    </svg>
  );
}

export function BatSwarm() {
  return <div className="bat-swarm" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <span key={i} className="flying-bat" data-burst data-x={Math.cos(i * 2.4) * (190 + i * 17)} data-y={-80 - (i % 5) * 48} data-spin={i % 2 ? 30 : -25}><Bat /></span>)}</div>;
}

export function CandyRain() {
  return <div className="candy-rain" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <span className={`candy candy--${i % 3}`} data-candy key={i} style={{ left: `${5 + (i * 31) % 90}%`, top: `${10 + (i * 17) % 75}%`, rotate: `${i * 37}deg` }} />)}</div>;
}
