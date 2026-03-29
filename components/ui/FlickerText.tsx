'use client';

interface FlickerTextProps {
  text: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function FlickerText({ text, style = {}, className = '' }: FlickerTextProps) {
  return (
    <span
      className={`flicker-name ${className}`}
      style={style}
    >
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="flicker-char"
          style={{
            display: 'inline-block',
            animationDelay: `${i * 0.08 + Math.sin(i) * 0.5}s`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}
