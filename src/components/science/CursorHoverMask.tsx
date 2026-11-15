import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Eye, Flame, Orbit, ScanLine } from 'lucide-react';

const CIRCLE_MASK_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='black'/%3E%3C/svg%3E")`;

export function CursorHoverMaskSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);
  const [isTextHovered, setIsTextHovered] = useState(false);
  const [lockedOpen, setLockedOpen] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    if (!isInside) setIsInside(true);
  };

  const maskDiameter = lockedOpen ? 2400 : isInside ? (isTextHovered ? 380 : 64) : 0;
  const maskX =
    lockedOpen && containerRef.current
      ? containerRef.current.clientWidth / 2 - maskDiameter / 2
      : coords.x - maskDiameter / 2;
  const maskY =
    lockedOpen && containerRef.current
      ? containerRef.current.clientHeight / 2 - maskDiameter / 2
      : coords.y - maskDiameter / 2;

  return (
    <section className="pt-12 sm:pt-14 brutal-scroll-section">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-10">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseMove}
          onMouseLeave={() => {
            setIsInside(false);
            setIsTextHovered(false);
          }}
          className="relative overflow-hidden border-2 border-[#111111] brutal-shadow bg-white select-none"
        >
          {/* Persistent top-right lock toggle button sitting above both layers */}
          <button
            type="button"
            onClick={() => setLockedOpen((prev) => !prev)}
            className="absolute top-6 right-6 sm:top-10 sm:right-10 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFE14D] border-2 border-[#111111] shadow-[2px_2px_0_#111111] text-xs font-mono font-bold text-[#111111] hover:bg-[#B4DCF2] transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{lockedOpen ? 'Show 1g View' : 'Lock 0g Mask'}</span>
          </button>

          {/* Base Layer: 1g Earth Gravity Perspective */}
          <div className="relative z-10 px-6 py-10 sm:px-12 sm:py-14 flex flex-col justify-between gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pr-36 sm:pr-44">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FDFBE8] border-2 border-[#111111] text-xs font-mono font-bold uppercase tracking-wider text-[#111111]">
                <ScanLine className="w-3.5 h-3.5 text-[#F26C57]" />
                <span>1g Earth Physics · Hover Headline to Reveal 0g Reality</span>
              </div>
            </div>

            <div
              onMouseEnter={() => setIsTextHovered(true)}
              onMouseLeave={() => setIsTextHovered(false)}
              className="max-w-4xl py-2 cursor-crosshair"
            >
              <p className="text-2xl sm:text-3xl lg:text-[2.35rem] font-extrabold leading-[1.22] tracking-tight text-[#111111]">
                On Earth at 1g, buoyant hot air{' '}
                <span className="bg-[#FFE14D] px-1.5 border border-[#111111]">
                  lifts flames upward
                </span>{' '}
                into bright yellow teardrops, swirling visible smoke into ceiling detectors.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-mono text-[#444444]">
              <span className="inline-flex items-center gap-1.5 font-bold text-[#111111]">
                <Flame className="w-4 h-4 text-[#F26C57]" />
                <span>BUOYANCY-DRIVEN CONVECTION (1g)</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>Move cursor over the text to scan freefall combustion</span>
            </div>
          </div>

          {/* Masked Reveal Layer: 0g Microgravity Reality (cursor-hover-mask pattern) */}
          <motion.div
            aria-hidden={!lockedOpen}
            className="absolute inset-0 z-20 pointer-events-none bg-[#0A0A0A] text-[#FFE14D] px-6 py-10 sm:px-12 sm:py-14 flex flex-col justify-between gap-6"
            style={{
              maskImage: CIRCLE_MASK_SVG,
              WebkitMaskImage: CIRCLE_MASK_SVG,
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
            }}
            animate={{
              maskPosition: `${maskX}px ${maskY}px`,
              maskSize: `${maskDiameter}px ${maskDiameter}px`,
            }}
            transition={{
              type: 'tween',
              ease: [0.22, 1, 0.36, 1],
              duration: 0.32,
            }}
          >
            {/* Subtle NASA dark telemetry dot grid inside mask */}
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-20 bg-[radial-gradient(#42D9FF_1px,transparent_1px)] [background-size:20px_20px]"
            />

            <div className="relative flex flex-wrap items-center justify-between gap-3 pr-36 sm:pr-44">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFE14D] border-2 border-[#FFE14D] text-xs font-mono font-extrabold uppercase tracking-wider text-[#111111]">
                <Orbit className="w-3.5 h-3.5" />
                <span>0g Freefall Scan · NASA PSI X-Ray View</span>
              </div>
            </div>

            <div className="relative max-w-4xl py-2">
              <p className="text-2xl sm:text-3xl lg:text-[2.35rem] font-extrabold leading-[1.22] tracking-tight text-white">
                In 0g freefall, buoyancy vanishes—flames turn into{' '}
                <span className="bg-[#42D9FF] text-[#111111] px-1.5">
                  calm blue spheres
                </span>{' '}
                and unseen cool flames silently challenge smoke alarms.
              </p>
            </div>

            <div className="relative flex flex-wrap items-center gap-4 text-xs sm:text-sm font-mono text-[#B4DCF2]">
              <span className="inline-flex items-center gap-1.5 font-bold text-[#FFE14D]">
                <Orbit className="w-4 h-4" />
                <span>DIFFUSION-CONTROLLED COMBUSTION (10⁻⁶g · 500–800 K)</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>Observed in FLEX, BASS-II, SAFFIRE &amp; SAME</span>
            </div>
          </motion.div>

          {/* Synced yellow Neu-Brutalist optical reticle ring */}
          {!lockedOpen && (
            <motion.div
              aria-hidden="true"
              className="absolute top-0 left-0 z-[25] pointer-events-none rounded-full border-2 border-[#FFE14D] shadow-[0_0_0_2px_#111111]"
              animate={{
                x: maskX,
                y: maskY,
                width: maskDiameter,
                height: maskDiameter,
                opacity: isInside ? 1 : 0,
              }}
              transition={{
                type: 'tween',
                ease: [0.22, 1, 0.36, 1],
                duration: 0.32,
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
