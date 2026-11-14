"use client";

import { useEffect, useState } from "react";

/*
 * Tracks `prefers-reduced-motion` after hydration. The initial `false` keeps
 * the server and first client render identical; the media query is applied on
 * mount and kept in sync afterwards.
 */
export default function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);

    sync();
    query.addEventListener("change", sync);

    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
}
