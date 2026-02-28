/**
 * useBreakpoint — Responsive breakpoint hook
 *
 * Breakpoints:
 *   xs   < 480px   (small phone)
 *   sm   < 640px   (phone)
 *   md   < 768px   (large phone / small tablet)
 *   lg   < 1024px  (tablet)
 *   xl  >= 1024px  (desktop)
 */

import { useState, useEffect } from "react";

const BREAKPOINTS = { xs: 480, sm: 640, md: 768, lg: 1024 };

function getBreakpoint(width) {
  if (width < BREAKPOINTS.xs) return "xs";
  if (width < BREAKPOINTS.sm) return "sm";
  if (width < BREAKPOINTS.md) return "md";
  if (width < BREAKPOINTS.lg) return "lg";
  return "xl";
}

export function useBreakpoint() {
  const [bp, setBp] = useState(() => getBreakpoint(window.innerWidth));
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const handler = () => {
      const w = window.innerWidth;
      setWidth(w);
      setBp(getBreakpoint(w));
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return {
    bp,
    width,
    isMobile:  bp === "xs" || bp === "sm",         // < 640
    isTablet:  bp === "md" || bp === "lg",          // 640–1023
    isDesktop: bp === "xl",                         // >= 1024
    isSmall:   bp === "xs" || bp === "sm" || bp === "md", // < 768
  };
}
