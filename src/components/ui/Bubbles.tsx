const bubbles = [
  { left: "8%", size: 10, duration: 7, delay: 0 },
  { left: "20%", size: 6, duration: 5.5, delay: 1.2 },
  { left: "32%", size: 14, duration: 8.5, delay: 0.4 },
  { left: "45%", size: 8, duration: 6, delay: 2.1 },
  { left: "58%", size: 5, duration: 5, delay: 0.8 },
  { left: "68%", size: 12, duration: 7.5, delay: 1.8 },
  { left: "80%", size: 7, duration: 6.5, delay: 0.2 },
  { left: "90%", size: 9, duration: 8, delay: 2.6 },
];

export function Bubbles({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {bubbles.map((bubble, i) => (
        <span
          key={i}
          className="animate-rise-bubble absolute rounded-full border border-cream/40 bg-cream/10"
          style={{
            left: bubble.left,
            width: bubble.size,
            height: bubble.size,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
