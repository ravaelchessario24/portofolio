import React, { useEffect, useRef, useState } from 'react';

interface TypingRoleProps {
  text: string;
}

export default function TypingRole({ text }: TypingRoleProps) {
  const [displayed, setDisplayed] = useState(text);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setDisplayed(text);
    const el = spanRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      return;
    }

    // Start with the full text visible so recruiters can read it immediately, then cycle typing while hero is visible
    let charIdx = text.length;
    let deleting = true;
    let timerId = 0;
    let isHeroVisible = true;

    const step = () => {
      if (!isHeroVisible) return;
      if (!deleting) {
        charIdx = Math.min(text.length, charIdx + 1);
        setDisplayed(text.slice(0, charIdx));
        if (charIdx === text.length) {
          deleting = true;
          timerId = window.setTimeout(step, 2800);
          return;
        }
      } else {
        charIdx = Math.max(0, charIdx - 1);
        setDisplayed(text.slice(0, charIdx));
        if (charIdx === 0) {
          deleting = false;
          timerId = window.setTimeout(step, 360);
          return;
        }
      }
      timerId = window.setTimeout(step, deleting ? 26 : 54);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isHeroVisible = entry.isIntersecting;
        window.clearTimeout(timerId);
        if (isHeroVisible) {
          timerId = window.setTimeout(step, 2200);
        }
      },
      { threshold: 0.15 }
    );

    const heroEl = el.closest('.hero-section') || el;
    io.observe(heroEl);

    return () => {
      io.disconnect();
      window.clearTimeout(timerId);
    };
  }, [text]);

  return (
    <span ref={spanRef} className="typing-wrap" aria-label={text}>
      <span aria-hidden="true">{displayed || '\u00A0'}</span>
      <span className="typing-cursor" aria-hidden="true" />
    </span>
  );
}
