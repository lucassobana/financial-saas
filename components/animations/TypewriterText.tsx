"use client";

import { useState, useEffect } from "react";

export function TypewriterText({ text, speed = 80 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let index = 0;
    
    const timer = setInterval(() => {
      index++;
      setDisplayedText(text.substring(0, index));
      
      if (index >= text.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayedText}
      {isTyping && (
        <span className="inline-block w-0.5 h-[1em] bg-emerald-700 ml-1 align-middle animate-pulse"></span>
      )}
    </span>
  );
}