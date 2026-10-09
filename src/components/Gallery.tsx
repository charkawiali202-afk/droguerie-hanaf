"use client";
import { useRef, useState } from "react";

/** Main image + thumbnails. Crossfade between images; horizontal swipe on the main image (touch). */
export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  const start = useRef<{ x: number; y: number; t: number } | null>(null);
  const n = images.length;
  const go = (d: number) => setI((v) => (v + d + n) % n);
  const rtl = () => document.documentElement.dir === "rtl";

  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" || n < 2) return;
    start.current = { x: e.clientX, y: e.clientY, t: performance.now() };
  };
  const onUp = (e: React.PointerEvent) => {
    const s = start.current; start.current = null;
    if (!s) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    const v = Math.abs(dx) / (performance.now() - s.t);
    if (Math.abs(dx) > Math.abs(dy) && (Math.abs(dx) > 40 || v > 0.3)) go((dx < 0) !== rtl() ? 1 : -1);
  };

  return (
    <div>
      <div
        className="relative aspect-square touch-pan-y overflow-hidden rounded-3xl bg-surface select-none"
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => (start.current = null)}
        aria-roledescription="carrousel"
      >
        {images.map((src, k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src + k}
            src={src}
            alt={k === i ? alt : ""}
            aria-hidden={k !== i}
            draggable={false}
            loading={k === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ease-out ${k === i ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        {n > 1 && (
          <span className="absolute end-3 bottom-3 rounded-full bg-ink/60 px-2.5 py-1 text-xs font-semibold text-white tabular-nums backdrop-blur" dir="ltr">
            {i + 1} / {n}
          </span>
        )}
      </div>
      {n > 1 && (
        <ul className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {images.map((src, k) => (
            <li key={src + k} className="shrink-0">
              <button
                type="button"
                onClick={() => setI(k)}
                aria-pressed={k === i}
                aria-label={`${alt} ${k + 1}/${n}`}
                className="press block size-16 overflow-hidden rounded-xl opacity-60 ring-2 ring-transparent transition-[opacity,box-shadow] aria-pressed:opacity-100 aria-pressed:ring-blue sm:size-20"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src.replace(/([?&])w=\d+/, "$1w=200")} alt="" loading="lazy" draggable={false} className="size-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
