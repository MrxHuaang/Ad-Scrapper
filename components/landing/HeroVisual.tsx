"use client";



const CX = 300;
const CY = 300;

// transform-box:view-box makes CSS transformOrigin use SVG viewBox coords
// so "300px 300px" actually means the center of our 600×600 viewBox
const svgOrigin: React.CSSProperties = {
  transformOrigin: `${CX}px ${CY}px`,
  transformBox: "view-box" as React.CSSProperties["transformBox"],
};

const RINGS = [
  {
    r: 78,
    duration: 18,
    reverse: false,
    dash: "4 10",
    label: "FAA",
    count: "10,000+",
    labelAngle: 38,
    dotColor: "#e8b84b",
    dotR: 3.5,
    opacity: 0.12,
    gold: true,
  },
  {
    r: 146,
    duration: 32,
    reverse: true,
    dash: "6 16",
    label: "EASA",
    count: "8,000+",
    labelAngle: 158,
    dotColor: "rgba(255,255,255,0.65)",
    dotR: 3,
    opacity: 0.07,
    gold: false,
  },
  {
    r: 208,
    duration: 48,
    reverse: false,
    dash: "3 9",
    label: "TC",
    count: "3,000+",
    labelAngle: 248,
    dotColor: "rgba(255,255,255,0.5)",
    dotR: 2.5,
    opacity: 0.05,
    gold: false,
  },
  {
    r: 266,
    duration: 22,
    reverse: true,
    dash: "8 22",
    label: "ANAC",
    count: "450+",
    labelAngle: 318,
    dotColor: "#e8b84b",
    dotR: 3,
    opacity: 0.04,
    gold: true,
  },
] as const;

function polarXY(r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

export function HeroVisual() {
  return (
    <div className="pointer-events-none absolute top-1/2 z-0 hidden -translate-y-1/2 md:block md:right-[0%] md:h-[min(70vw,90vh)] md:w-[min(70vw,90vh)] lg:right-[2%] lg:h-[min(60vw,90vh)] lg:w-[min(60vw,90vh)]">
      <svg viewBox="0 0 600 600" className="h-full w-full" aria-hidden="true">
        <style>{`
          @keyframes radar-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes radar-spin-reverse {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
          }
          @keyframes radar-pulse {
            0% { transform: scale(1); opacity: 0.35; }
            100% { transform: scale(2.33); opacity: 0; }
          }
        `}</style>
        <defs>
          <radialGradient id="heroCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e8b84b" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#e8b84b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient center glow */}
        <circle cx={CX} cy={CY} r={300} fill="url(#heroCenter)" />

        {/* Rings */}
        {RINGS.map((ring) => {
          const lp = polarXY(ring.r + 30, ring.labelAngle);

          return (
            <g key={ring.r}>
              {/* Static dashed ring */}
              <circle
                cx={CX} cy={CY} r={ring.r}
                fill="none"
                stroke="white"
                strokeWidth={0.8}
                strokeDasharray={ring.dash}
                opacity={ring.opacity}
              />

              {/* Orbiting dot — rotates around viewBox center */}
              <g
                style={{
                  ...svgOrigin,
                  animation: `${ring.reverse ? "radar-spin-reverse" : "radar-spin"} ${ring.duration}s linear infinite`
                }}
              >
                {/* Halo */}
                <circle
                  cx={CX} cy={CY - ring.r}
                  r={ring.dotR + 3}
                  fill={ring.dotColor}
                  opacity={0.14}
                />
                {/* Core */}
                <circle
                  cx={CX} cy={CY - ring.r}
                  r={ring.dotR}
                  fill={ring.dotColor}
                />
              </g>

              {/* Fixed label */}
              <text
                x={lp.x} y={lp.y - 5}
                textAnchor="middle"
                fill="rgba(255,255,255,0.5)"
                fontSize="10"
                fontWeight="600"
                letterSpacing="0.12em"
                fontFamily="var(--font-geist-sans, ui-sans-serif, sans-serif)"
              >
                {ring.label}
              </text>
              <text
                x={lp.x} y={lp.y + 8}
                textAnchor="middle"
                fill="rgba(255,255,255,0.22)"
                fontSize="8.5"
                letterSpacing="0.04em"
                fontFamily="var(--font-geist-sans, ui-sans-serif, sans-serif)"
              >
                {ring.count}
              </text>
            </g>
          );
        })}

        {/* Radar sweep — rotates around center using view-box coords */}
        <g
          style={{
            ...svgOrigin,
            animation: "radar-spin 9s linear infinite"
          }}
        >
          {/* Afterglow trail (static offsets within the rotating group) */}
          {Array.from({ length: 7 }).map((_, i) => (
            <line
              key={i}
              x1={CX} y1={CY}
              x2={CX} y2={CY - 278}
              stroke="#e8b84b"
              strokeWidth={1}
              opacity={(7 - i) * 0.011}
              transform={`rotate(${-(i + 1) * 5} ${CX} ${CY})`}
            />
          ))}
          {/* Leading edge */}
          <line
            x1={CX} y1={CY}
            x2={CX} y2={CY - 278}
            stroke="#e8b84b"
            strokeWidth={1}
            opacity={0.22}
          />
        </g>

        {/* Center core */}
        <circle cx={CX} cy={CY} r={5} fill="#e8b84b" opacity={0.95} />

        {/* Pulse rings */}
        {([0, 1.2] as const).map((delay) => (
          <circle
            key={delay}
            cx={CX} cy={CY} r={12}
            fill="none"
            stroke="#e8b84b"
            strokeWidth={0.8}
            style={{
              transformOrigin: `${CX}px ${CY}px`,
              animation: `radar-pulse 2.4s ease-out infinite`,
              animationDelay: `${delay}s`
            }}
          />
        ))}

        {/* Total label */}
        <text
          x={CX} y={CY + 30}
          textAnchor="middle"
          fill="rgba(232,184,75,0.35)"
          fontSize="8"
          fontWeight="600"
          letterSpacing="0.15em"
          fontFamily="var(--font-geist-sans, ui-sans-serif, sans-serif)"
        >
          21,450+ DIRECTIVES
        </text>
      </svg>
    </div>
  );
}
