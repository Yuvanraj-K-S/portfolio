"use client";

const items = [
  "YUVANRAJ", "FULL STACK", "ML ENGINEER", "PROBLEM SOLVER",
  "REACT", "NEXT.JS", "PYTORCH", "THREE.JS", "NODE.JS",
  "TENSORFLOW", "AZURE", "DOCKER", "POSTGRESQL", "LANGCHAIN",
];

export default function Marquee() {
  const doubled = [...items, ...items];

  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        padding: "14px 0",
        borderTop:    "1px solid rgba(26,26,46,0.10)",
        borderBottom: "1px solid rgba(26,26,46,0.10)",
        background: "rgba(224,213,242,0.5)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 40,
          width: "max-content",
          animation: "marquee 20s linear infinite",
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 11,
              letterSpacing: "0.12em",
              whiteSpace: "nowrap",
              color: i % 7 === 0 ? "var(--secondary)" : "var(--muted)",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}