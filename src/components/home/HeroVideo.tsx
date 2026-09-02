"use client";

import { useEffect, useRef, useState } from "react";

const clips = [
  { src: "/videos/hero-1.mp4", poster: "/images/hero-poster.jpg" },
  { src: "/videos/hero-2.mp4" },
  { src: "/videos/hero-3.mp4" },
];

export function HeroVideo() {
  const [current, setCurrent] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === current) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [current]);

  return (
    <>
      {clips.map((clip, i) => (
        <video
          key={clip.src}
          ref={(el) => {
            videoRefs.current[i] = el;
          }}
          muted
          playsInline
          preload="auto"
          poster={clip.poster}
          aria-hidden="true"
          tabIndex={-1}
          onEnded={() => setCurrent((c) => (c + 1) % clips.length)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={clip.src} type="video/mp4" />
        </video>
      ))}
    </>
  );
}
