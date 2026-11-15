import React, { useRef, useState } from 'react';
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';

export interface FloatingDockItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  active?: boolean;
  isBrand?: boolean;
  accentBg?: string;
  onClick: () => void;
}

interface FloatingDockProps {
  items: FloatingDockItem[];
  className?: string;
}

export function FloatingDock({ items, className = '' }: FloatingDockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <nav
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      aria-label="Primary Mission Navigation"
      className={`inline-flex items-end gap-2.5 sm:gap-3.5 rounded-2xl bg-white border-2 border-[#111111] shadow-[5px_5px_0_#111111] px-3.5 sm:px-4 py-2.5 h-[64px] sm:h-[70px] ${className}`}
    >
      {items.map((item) => (
        <DockIconButton key={item.id} mouseX={mouseX} item={item} />
      ))}
    </nav>
  );
}

function DockIconButton({
  mouseX,
  item,
}: {
  mouseX: MotionValue<number>;
  item: FloatingDockItem;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeTransform = useTransform(distance, [-140, 0, 140], [42, 64, 42]);
  const iconScaleTransform = useTransform(distance, [-140, 0, 140], [1, 1.34, 1]);

  const springConfig = { mass: 0.1, stiffness: 170, damping: 14 };
  const animatedSize = useSpring(sizeTransform, springConfig);
  const animatedIconScale = useSpring(iconScaleTransform, springConfig);

  const activeColor = item.accentBg ?? '#FFE14D';
  const bgColor = item.isBrand
    ? '#FFE14D'
    : item.active
    ? activeColor
    : hovered
    ? activeColor
    : '#FDFBE8';
  const iconColor = '#111111';

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={item.onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label={item.title}
      aria-current={item.active ? 'page' : undefined}
      style={{
        width: prefersReducedMotion ? 42 : animatedSize,
        height: prefersReducedMotion ? 42 : animatedSize,
        backgroundColor: bgColor,
        color: iconColor,
      }}
      whileTap={{ y: 2 }}
      className="relative rounded-full border-2 border-[#111111] shadow-[2px_2px_0_#111111] flex items-center justify-center cursor-pointer transition-colors shrink-0"
    >
      <motion.span
        style={{ scale: prefersReducedMotion ? 1 : animatedIconScale }}
        className="flex items-center justify-center pointer-events-none"
      >
        {item.icon}
      </motion.span>

      {/* Active route dot */}
      {item.active && !item.isBrand && (
        <span
          aria-hidden="true"
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#111111]"
        />
      )}

      {/* Upward Floating Tooltip above bottom dock */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 6, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 4, x: '-50%' }}
            transition={{ duration: 0.14 }}
            className="pointer-events-none absolute left-1/2 bottom-full mb-3 px-2.5 py-1 bg-[#0A0A0A] text-[#FFE14D] border-2 border-[#111111] shadow-[2px_2px_0_#111111] text-xs font-mono font-extrabold whitespace-nowrap z-50"
          >
            {item.title}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
