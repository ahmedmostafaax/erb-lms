"use client";

import { useState } from "react";

export function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1" dir="ltr">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="text-2xl leading-none transition-colors"
          aria-label={`${star} stars`}
        >
          <span className={(hover || value) >= star ? "text-accent" : "text-line"}>★</span>
        </button>
      ))}
    </div>
  );
}
