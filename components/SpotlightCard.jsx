"use client";

import { useEffect, useRef } from "react";
import styles from "./SpotlightCard.module.css";

// Adapted from React Bits "Spotlight Card" (https://reactbits.dev/components/spotlight-card),
// MIT + Commons Clause. Trimmed to the options used on this site and themed with its tokens.

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const falloff = (color, softness) => {
  const soft = clamp(softness, 0, 1);
  const core = (1 - soft) ** 1.5 * 0.85;
  const stop = (alpha, at) =>
    `color-mix(in srgb, ${color} ${(alpha * 100).toFixed(2)}%, transparent) ${(at * 100).toFixed(2)}%`;
  const list = [stop(1, 0)];
  for (let i = 0; i <= 14; i += 1) {
    const t = core + ((1 - core) * i) / 14;
    const g = (t - core) / (1 - core);
    const smooth = 1 - g * g * (3 - 2 * g);
    const glow = Math.exp(-4.6 * g * g) * (1 - g ** 6);
    list.push(stop(smooth + (glow - smooth) * soft, t));
  }
  return list.join(", ");
};

export default function SpotlightCard({
  children,
  className = "",
  color = "#8b7bff",
  intensity = 0.16,
  size = 280,
  softness = 0.7,
  borderGlow = 0.5,
  proximity = 90,
  smoothing = 0.3,
  ...rest
}) {
  const rootRef = useRef(null);
  const lightRef = useRef(null);
  const edgeRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const light = lightRef.current;
    const edge = edgeRef.current;
    if (!root || !light || !edge) return undefined;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const fill = falloff(color, softness);
    const rim = falloff(color, 1);
    const reach = Math.max(20, size);
    const glow = clamp(intensity, 0, 1);
    const border = clamp(borderGlow, 0, 1);
    const near = Math.max(0, proximity);
    const ease = clamp(smoothing, 0, 1);

    const state = { x: 0, y: 0, presence: 0, flare: 0, pressed: false, visible: true };
    const pointer = { x: 0, y: 0, active: false };
    let frame = 0;
    let last = 0;
    let alive = true;

    const paint = () => {
      const width = reach * (1 + 0.2 * state.flare);
      const boost = 1 + 0.7 * state.flare;
      const x = state.x.toFixed(1);
      const y = state.y.toFixed(1);
      light.style.background = `radial-gradient(circle ${width.toFixed(1)}px at ${x}px ${y}px, ${fill})`;
      edge.style.background = `radial-gradient(circle ${(width * 0.6).toFixed(1)}px at ${x}px ${y}px, ${rim})`;
      light.style.opacity = String(Math.min(1, state.presence * glow * boost));
      edge.style.opacity = String(Math.min(1, state.presence * border * boost));
    };

    const tick = (now) => {
      frame = 0;
      if (!alive) return;

      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;

      const rect = root.getBoundingClientRect();
      let tx = state.x;
      let ty = state.y;
      let target = 0;

      if (pointer.active) {
        tx = pointer.x - rect.left;
        ty = pointer.y - rect.top;
        const gap = Math.hypot(
          Math.max(0, -tx, tx - rect.width),
          Math.max(0, -ty, ty - rect.height),
        );
        if (gap === 0) target = 1;
        else if (near > 0) target = Math.max(0, 1 - gap / near) ** 2;
      }

      if (state.presence < 0.02 && target > 0) {
        state.x = tx;
        state.y = ty;
      }

      const follow = reduce || ease === 0 ? 1 : 1 - Math.exp(-dt / (0.015 + ease * 0.22));
      state.x += (tx - state.x) * follow;
      state.y += (ty - state.y) * follow;

      const fade = reduce ? 1 : 1 - Math.exp(-dt / (target > state.presence ? 0.1 : 0.32));
      state.presence += (target - state.presence) * fade;
      if (Math.abs(target - state.presence) < 0.002) state.presence = target;

      const press = state.pressed && !reduce ? 1 : 0;
      state.flare += (press - state.flare) * (1 - Math.exp(-dt / (press ? 0.05 : 0.28)));
      if (Math.abs(press - state.flare) < 0.002) state.flare = press;

      paint();

      const moving = Math.abs(tx - state.x) > 0.1 || Math.abs(ty - state.y) > 0.1;
      const settled = !moving && state.presence === target && state.flare === press;
      if (!settled) frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (frame || !alive || !state.visible) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;

      if (state.presence > 0) {
        wake();
        return;
      }

      const rect = root.getBoundingClientRect();
      const dx = Math.max(0, rect.left - event.clientX, event.clientX - rect.right);
      const dy = Math.max(0, rect.top - event.clientY, event.clientY - rect.bottom);
      if (near > 0 && Math.hypot(dx, dy) <= near) wake();
    };

    const onOut = (event) => {
      if (event.relatedTarget) return;
      pointer.active = false;
      wake();
    };

    const onDown = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
      state.pressed = true;
      wake();
    };

    const onUp = () => {
      if (!state.pressed) return;
      state.pressed = false;
      wake();
    };

    const observer = new IntersectionObserver((entries) => {
      state.visible = entries.some((entry) => entry.isIntersecting);
      if (!state.visible) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    observer.observe(root);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    document.addEventListener("pointerout", onOut);
    root.addEventListener("pointerdown", onDown);

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.removeEventListener("pointerout", onOut);
      root.removeEventListener("pointerdown", onDown);
    };
  }, [color, intensity, size, softness, borderGlow, proximity, smoothing]);

  return (
    <div ref={rootRef} className={[styles.card, className].filter(Boolean).join(" ")} {...rest}>
      <span ref={lightRef} className={styles.light} aria-hidden="true" />
      {children}
      <span ref={edgeRef} className={styles.edge} aria-hidden="true" />
    </div>
  );
}
