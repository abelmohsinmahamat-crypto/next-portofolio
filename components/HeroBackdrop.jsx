"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import styles from "./HeroBackdrop.module.css";

/*
 * The shader is decorative and client-only: load it as a separate chunk after
 * hydration so it never blocks the hero's first paint or the LCP image.
 */
const FluxLines = dynamic(() => import("./FluxLines"), { ssr: false });

function supportsWebGL2() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export default function HeroBackdrop() {
  const [active, setActive] = useState(false);
  const [dpr, setDpr] = useState(1.5);
  const [interactive, setInteractive] = useState(true);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseQuery = window.matchMedia("(pointer: coarse)");
    let cancelled = false;
    let idleHandle;

    const cancelIdle = () => {
      if (idleHandle === undefined) return;
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleHandle);
      } else {
        window.clearTimeout(idleHandle);
      }
      idleHandle = undefined;
    };

    const activate = () => {
      idleHandle = undefined;
      if (cancelled || motionQuery.matches || !supportsWebGL2()) return;

      // Touch devices gain nothing from the cursor magnet, so skip the work.
      const coarse = coarseQuery.matches;
      setDpr(coarse ? 1.15 : 1.5);
      setInteractive(!coarse);
      setActive(true);
    };

    const schedule = () => {
      if (cancelled || motionQuery.matches) return;
      if (typeof window.requestIdleCallback === "function") {
        idleHandle = window.requestIdleCallback(activate, { timeout: 1500 });
      } else {
        idleHandle = window.setTimeout(activate, 250);
      }
    };

    const onMotionChange = () => {
      cancelIdle();
      if (motionQuery.matches) {
        setActive(false);
        return;
      }
      schedule();
    };

    schedule();
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      cancelled = true;
      cancelIdle();
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.effect}>
        <div className={styles.fallback} />
        {active ? (
          <FluxLines
            className={styles.canvasLayer}
            colors={["#8b7bff", "#5b8cff", "#a78bfa"]}
            speed={0.35}
            scale={1.5}
            glow={0.9}
            rimWidth={0.16}
            lineWidth={0.9}
            shimmer={1}
            turbulence={0.8}
            opacity={0.12}
            flowDirection="down"
            dpr={dpr}
            mouseInteraction={interactive}
            clickSwirl={interactive}
          />
        ) : null}
      </div>
      <div className={styles.scrim} />
    </div>
  );
}
