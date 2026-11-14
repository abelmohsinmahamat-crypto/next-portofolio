"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import usePrefersReducedMotion from "@/lib/usePrefersReducedMotion";
import {
  CORE_N,
  GRAIN_N,
  SPIKE_N,
  SPHERE_R,
  buildCloud,
  clamp,
  easeInOutCubic,
  headingOf,
  mixHex,
  nextSeed,
  project,
  rgba,
} from "@/lib/inkOrbit";
import styles from "./InkOrbitSculpture.module.css";

const DEFAULT_INK = "#f4f6fb";
const DEFAULT_BACKGROUND = "#0a0f1d";
const DEPTH_BINS = 7;
const FOCAL_LENGTH = 3.4;

/*
 * A generative ink sculpture drawn on a 2D canvas.
 *
 * The point cloud is rebuilt only when the seed changes; rotating, idle spin,
 * morphing and pointer interactions all happen inside a single request
 * animation frame loop. Drawing pauses while the canvas is off-screen.
 */
export default function InkOrbitSculpture({
  height = "100%",
  ink = DEFAULT_INK,
  background = DEFAULT_BACKGROUND,
  seed: seedProp = 4211,
  onReforge,
  autoReforge = 0,
  spin = 0.16,
  density = 1,
  glass = true,
  hud = true,
  label = "INK · 3D",
  hint = "Glissez pour tourner · Cliquez pour reforger",
  interactive = true,
  maxDpr = 2,
  className = "",
}) {
  const canvasRef = useRef(null);
  const headingRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  const [seed, setSeed] = useState(seedProp);
  const [previousSeedProp, setPreviousSeedProp] = useState(seedProp);

  /* Keep the internal seed in sync when the prop is changed by the parent. */
  if (seedProp !== previousSeedProp) {
    setPreviousSeedProp(seedProp);
    setSeed(seedProp);
  }

  const seedRef = useRef(seed);
  useEffect(() => {
    seedRef.current = seed;
  }, [seed]);

  const onReforgeRef = useRef(onReforge);
  useEffect(() => {
    onReforgeRef.current = onReforge;
  }, [onReforge]);

  const grainN = Math.round(GRAIN_N * clamp(density, 0.25, 1.5));

  /*
   * Mutable per-frame state. Keeping it in a ref avoids re-rendering React on
   * every pointer move or animation frame.
   */
  const runtimeRef = useRef({
    yaw: 0.6,
    pitch: 0.18,
    yawVelocity: 0,
    pitchVelocity: 0,
    leanYaw: 0,
    leanPitch: 0,
    targetLeanYaw: 0,
    targetLeanPitch: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    downX: 0,
    downY: 0,
    lastTime: 0,
    from: null,
    to: null,
    morph: 1,
    ring: 0,
    dirty: true,
    visible: true,
    heading: -1,
    ink,
    background,
    reduced: reducedMotion,
    spin,
    glass,
  });

  /* Keep the frame loop in sync with props without re-rendering it. */
  useEffect(() => {
    const runtime = runtimeRef.current;

    runtime.ink = ink;
    runtime.background = background;
    runtime.reduced = reducedMotion;
    runtime.spin = spin;
    runtime.glass = glass;
    runtime.dirty = true;
  }, [ink, background, reducedMotion, spin, glass]);

  const reforge = useCallback(() => {
    const next = nextSeed(seedRef.current);

    seedRef.current = next;
    setSeed(next);
    onReforgeRef.current?.(next);
  }, []);

  /* A new seed morphs every point from its current shape to the next one. */
  const builtRef = useRef({ seed: Number.NaN, grainN: 0 });

  useEffect(() => {
    const current = runtimeRef.current;
    const previous = builtRef.current;
    const nextCloud = buildCloud(seed, CORE_N, grainN, SPIKE_N);
    const canMorph = current.to !== null && previous.grainN === grainN && previous.seed !== seed;

    current.from = canMorph ? current.to : null;
    current.to = nextCloud;
    current.morph = canMorph && !current.reduced ? 0 : 1;
    current.ring = canMorph && !current.reduced ? 1 : 0;
    current.dirty = true;
    builtRef.current = { seed, grainN };
  }, [seed, grainN]);

  useEffect(() => {
    if (!autoReforge || autoReforge <= 0 || reducedMotion) return undefined;

    const timer = window.setInterval(() => {
      const current = runtimeRef.current;

      if (current.visible && !current.dragging) reforge();
    }, Math.max(2, autoReforge) * 1000);

    return () => window.clearInterval(timer);
  }, [autoReforge, reducedMotion, reforge]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const lens = document.createElement("canvas");
    const lensContext = lens.getContext("2d");
    const current = runtimeRef.current;

    let width = 0;
    let heightPx = 0;
    let dpr = 1;

    const resize = () => {
      dpr = clamp(window.devicePixelRatio || 1, 1, Math.max(1, maxDpr));
      width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      heightPx = Math.max(1, Math.round(canvas.clientHeight * dpr));
      canvas.width = width;
      canvas.height = heightPx;
      current.dirty = true;
    };

    resize();

    const resizeObserver =
      typeof ResizeObserver === "function" ? new ResizeObserver(resize) : null;
    resizeObserver?.observe(canvas);

    const intersectionObserver =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver(
            (entries) => {
              current.visible = entries.some((entry) => entry.isIntersecting);
              current.dirty = true;
            },
            { rootMargin: "120px" },
          )
        : null;
    intersectionObserver?.observe(canvas);

    const screenX = new Float32Array(CORE_N + grainN);
    const screenY = new Float32Array(CORE_N + grainN);
    const coreRadius = new Float32Array(CORE_N);
    const depthBin = new Uint8Array(CORE_N + grainN);

    let frame = 0;

    const draw = (now) => {
      frame = requestAnimationFrame(draw);

      const delta = current.lastTime ? Math.min(0.05, (now - current.lastTime) / 1000) : 1 / 60;
      current.lastTime = now;

      const cloud = current.to;
      if (!current.visible || !cloud || cloud.grain.length !== grainN * 3) return;

      /* Idle spin eases back in after a flick; pitch gently springs home. */
      if (!current.dragging) {
        const targetSpin = current.reduced ? 0 : current.spin;

        current.yawVelocity += (targetSpin - current.yawVelocity) * Math.min(1, delta * 1.6);
        current.yaw += current.yawVelocity * delta;
        current.pitch += current.pitchVelocity * delta;
        current.pitchVelocity *= 0.04 ** delta;
        current.pitch += (0.18 - current.pitch) * Math.min(1, delta * 0.9);
      }

      current.pitch = clamp(current.pitch, -0.95, 1.25);
      current.leanYaw += (current.targetLeanYaw - current.leanYaw) * Math.min(1, delta * 3);
      current.leanPitch += (current.targetLeanPitch - current.leanPitch) * Math.min(1, delta * 3);

      if (current.morph < 1) current.morph = Math.min(1, current.morph + delta / 1.3);
      if (current.ring > 0) current.ring = Math.max(0, current.ring - delta / 1.1);

      const moving =
        !current.reduced ||
        current.dragging ||
        Math.abs(current.yawVelocity) > 0.002 ||
        Math.abs(current.pitchVelocity) > 0.002 ||
        current.morph < 1 ||
        current.ring > 0 ||
        Math.abs(current.targetLeanYaw - current.leanYaw) > 0.001 ||
        Math.abs(current.targetLeanPitch - current.leanPitch) > 0.001;

      if (!moving && !current.dirty) return;
      current.dirty = false;

      const yaw = current.yaw + current.leanYaw;
      const pitch = current.pitch + current.leanPitch;

      const heading = headingOf(yaw);
      if (heading !== current.heading && headingRef.current) {
        current.heading = heading;
        headingRef.current.textContent = `N ${String(heading).padStart(3, "0")}°`;
      }

      const inkColor = current.ink;
      const pageColor = current.background;

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, width, heightPx);

      const centerX = width / 2;
      const centerY = heightPx / 2;
      const scale = Math.min(width, heightPx) * 0.34;
      const morph = easeInOutCubic(current.morph);
      const previousCloud =
        current.from && current.from.grain.length === cloud.grain.length ? current.from : null;

      const mixPoint = (arrB, arrA, index) =>
        arrA && morph < 1 ? arrA[index] + (arrB[index] - arrA[index]) * morph : arrB[index];

      /* Crosshair behind everything. */
      const reach = scale * 1.38;
      const crosshairGradient = (x1, y1, x2, y2) => {
        const gradient = context.createLinearGradient(x1, y1, x2, y2);

        gradient.addColorStop(0, mixHex(inkColor, pageColor, 1));
        gradient.addColorStop(0.5, mixHex(inkColor, pageColor, 0.35));
        gradient.addColorStop(1, mixHex(inkColor, pageColor, 1));
        return gradient;
      };

      context.lineWidth = Math.max(1, dpr);
      context.strokeStyle = crosshairGradient(centerX, centerY - reach, centerX, centerY + reach);
      context.beginPath();
      context.moveTo(centerX, centerY - reach);
      context.lineTo(centerX, centerY + reach);
      context.stroke();

      context.strokeStyle = crosshairGradient(centerX - reach, centerY, centerX + reach, centerY);
      context.beginPath();
      context.moveTo(centerX - reach, centerY);
      context.lineTo(centerX + reach, centerY);
      context.stroke();

      /* Reforge shock ring. */
      if (current.ring > 0) {
        const progress = 1 - current.ring;

        context.strokeStyle = rgba(inkColor, pageColor, 0.2 + 0.7 * progress, current.ring * 0.8);
        context.lineWidth = Math.max(1, dpr * (1 + 2 * current.ring));
        context.beginPath();
        context.arc(centerX, centerY, scale * (0.32 + progress * 1.25), 0, Math.PI * 2);
        context.stroke();
      }

      /* Project every point into screen space once per frame. */
      for (let index = 0; index < CORE_N; index += 1) {
        const [x, y, z, pointScale] = project(
          mixPoint(cloud.core, previousCloud?.core, index * 4),
          mixPoint(cloud.core, previousCloud?.core, index * 4 + 1),
          mixPoint(cloud.core, previousCloud?.core, index * 4 + 2),
          yaw,
          pitch,
          FOCAL_LENGTH,
        );

        screenX[index] = centerX + x * scale;
        screenY[index] = centerY + y * scale;
        coreRadius[index] =
          mixPoint(cloud.core, previousCloud?.core, index * 4 + 3) * scale * pointScale * 0.78;
        depthBin[index] = clamp(
          Math.floor(((z + 1.25) / 2.5) * DEPTH_BINS),
          0,
          DEPTH_BINS - 1,
        );
      }

      for (let index = 0; index < grainN; index += 1) {
        const screenIndex = CORE_N + index;
        const [x, y, z] = project(
          mixPoint(cloud.grain, previousCloud?.grain, index * 3),
          mixPoint(cloud.grain, previousCloud?.grain, index * 3 + 1),
          mixPoint(cloud.grain, previousCloud?.grain, index * 3 + 2),
          yaw,
          pitch,
          FOCAL_LENGTH,
        );

        screenX[screenIndex] = centerX + x * scale;
        screenY[screenIndex] = centerY + y * scale;
        depthBin[screenIndex] = clamp(
          Math.floor(((z + 1.25) / 2.5) * DEPTH_BINS),
          0,
          DEPTH_BINS - 1,
        );
      }

      const grainSize = Math.max(1, 1.15 * dpr);

      const paintDepthBin = (bin) => {
        const fade = 0.62 * (1 - bin / (DEPTH_BINS - 1));

        context.fillStyle = mixHex(inkColor, pageColor, fade);
        context.beginPath();

        for (let index = 0; index < CORE_N; index += 1) {
          if (depthBin[index] !== bin) continue;

          context.moveTo(screenX[index] + coreRadius[index], screenY[index]);
          context.arc(screenX[index], screenY[index], coreRadius[index], 0, Math.PI * 2);
        }

        context.fill();

        context.fillStyle = mixHex(inkColor, pageColor, Math.min(0.85, fade + 0.12));
        for (let index = CORE_N; index < CORE_N + grainN; index += 1) {
          if (depthBin[index] === bin) {
            context.fillRect(screenX[index], screenY[index], grainSize, grainSize);
          }
        }
      };

      const paintSpikes = (front) => {
        context.lineWidth = Math.max(0.75, 0.8 * dpr);

        for (let spike = 0; spike < SPIKE_N; spike += 1) {
          const offset = spike * 6;
          const start = project(
            mixPoint(cloud.spikes, previousCloud?.spikes, offset),
            mixPoint(cloud.spikes, previousCloud?.spikes, offset + 1),
            mixPoint(cloud.spikes, previousCloud?.spikes, offset + 2),
            yaw,
            pitch,
            FOCAL_LENGTH,
          );
          const end = project(
            mixPoint(cloud.spikes, previousCloud?.spikes, offset + 3),
            mixPoint(cloud.spikes, previousCloud?.spikes, offset + 4),
            mixPoint(cloud.spikes, previousCloud?.spikes, offset + 5),
            yaw,
            pitch,
            FOCAL_LENGTH,
          );

          if (start[2] >= 0 !== front) continue;

          const gradient = context.createLinearGradient(
            centerX + start[0] * scale,
            centerY + start[1] * scale,
            centerX + end[0] * scale,
            centerY + end[1] * scale,
          );

          gradient.addColorStop(0, mixHex(inkColor, pageColor, front ? 0.1 : 0.5));
          gradient.addColorStop(1, mixHex(inkColor, pageColor, 1));

          context.strokeStyle = gradient;
          context.beginPath();
          context.moveTo(centerX + start[0] * scale, centerY + start[1] * scale);
          context.lineTo(centerX + end[0] * scale, centerY + end[1] * scale);
          context.stroke();
        }
      };

      paintSpikes(false);
      for (let bin = 0; bin < Math.floor(DEPTH_BINS / 2) + 1; bin += 1) paintDepthBin(bin);

      if (current.glass) {
        /* The glass sphere: an inverted, shrunken copy of what is behind it. */
        const radius = SPHERE_R * scale;
        const span = radius * 3.1;

        if (lensContext) {
          const lensSize = Math.max(1, Math.ceil(radius * 2));

          if (lens.width !== lensSize) {
            lens.width = lensSize;
            lens.height = lensSize;
          }

          lensContext.setTransform(1, 0, 0, 1, 0, 0);
          lensContext.fillStyle = pageColor;
          lensContext.fillRect(0, 0, lensSize, lensSize);
          lensContext.drawImage(
            canvas,
            centerX - span,
            centerY - span,
            span * 2,
            span * 2,
            0,
            0,
            lensSize,
            lensSize,
          );
        }

        context.save();
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, Math.PI * 2);
        context.clip();
        context.fillStyle = pageColor;
        context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

        if (lensContext) {
          context.translate(centerX, centerY);
          context.rotate(Math.PI + yaw * 0.15);
          context.globalAlpha = 0.85;
          context.drawImage(lens, -radius, -radius, radius * 2, radius * 2);
          context.globalAlpha = 1;
          context.setTransform(1, 0, 0, 1, 0, 0);
        }

        const rim = context.createRadialGradient(
          centerX - radius * 0.25,
          centerY - radius * 0.3,
          radius * 0.1,
          centerX,
          centerY,
          radius,
        );
        rim.addColorStop(0, "rgba(255,255,255,.55)");
        rim.addColorStop(0.55, "rgba(255,255,255,.12)");
        rim.addColorStop(0.86, rgba(inkColor, pageColor, 0.82, 0.25));
        rim.addColorStop(1, rgba(inkColor, pageColor, 0.3, 0.7));
        context.fillStyle = rim;
        context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

        const highlight = context.createRadialGradient(
          centerX - radius * 0.38,
          centerY - radius * 0.42,
          0,
          centerX - radius * 0.38,
          centerY - radius * 0.42,
          radius * 0.42,
        );
        highlight.addColorStop(0, "rgba(255,255,255,.9)");
        highlight.addColorStop(1, "rgba(255,255,255,0)");
        context.fillStyle = highlight;
        context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
        context.restore();

        context.strokeStyle = mixHex(inkColor, pageColor, 0.45);
        context.lineWidth = Math.max(1, dpr);
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, Math.PI * 2);
        context.stroke();
      }

      for (let bin = Math.floor(DEPTH_BINS / 2) + 1; bin < DEPTH_BINS; bin += 1) paintDepthBin(bin);
      paintSpikes(true);
    };

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
    };
  }, [grainN, maxDpr]);

  const handlePointerDown = (event) => {
    if (!interactive) return;

    const current = runtimeRef.current;

    current.dragging = true;
    current.lastX = current.downX = event.clientX;
    current.lastY = current.downY = event.clientY;
    current.yawVelocity = 0;
    current.pitchVelocity = 0;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!interactive) return;

    const current = runtimeRef.current;

    if (current.dragging) {
      const deltaX = event.clientX - current.lastX;
      const deltaY = event.clientY - current.lastY;

      current.lastX = event.clientX;
      current.lastY = event.clientY;
      current.yaw += deltaX * 0.01;
      current.pitch += deltaY * 0.008;
      current.yawVelocity = deltaX * 0.6;
      current.pitchVelocity = deltaY * 0.45;
    } else if (event.pointerType === "mouse") {
      const bounds = event.currentTarget.getBoundingClientRect();

      current.targetLeanYaw = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.5;
      current.targetLeanPitch = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.5;
    }

    current.dirty = true;
  };

  const handlePointerUp = (event) => {
    const current = runtimeRef.current;
    if (!current.dragging) return;

    current.dragging = false;
    current.yawVelocity = clamp(current.yawVelocity, -6, 6);
    current.pitchVelocity = clamp(current.pitchVelocity, -3, 3);

    const moved = Math.hypot(event.clientX - current.downX, event.clientY - current.downY);
    if (moved < 4) reforge();
  };

  const handlePointerLeave = () => {
    runtimeRef.current.targetLeanYaw = 0;
    runtimeRef.current.targetLeanPitch = 0;
  };

  const handleKeyDown = (event) => {
    if (!interactive) return;

    const current = runtimeRef.current;

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      current.yawVelocity = event.key === "ArrowLeft" ? -2.4 : 2.4;
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      current.pitchVelocity = event.key === "ArrowUp" ? -1.6 : 1.6;
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      reforge();
    } else {
      return;
    }

    current.dirty = true;
  };

  return (
    <div
      className={`${styles.root} ${className}`.trim()}
      style={{
        height,
        background: `radial-gradient(60% 55% at 50% 50%, ${mixHex(ink, background, 0.94)}, ${background})`,
        color: rgba(ink, background, 0.55, 1),
      }}
    >
      <canvas
        ref={canvasRef}
        role="img"
        tabIndex={interactive ? 0 : -1}
        aria-label={
          interactive
            ? "Sculpture d'encre générative. Glissez ou utilisez les flèches pour la faire tourner, appuyez sur Entrée pour la reforger."
            : "Sculpture d'encre générative."
        }
        className={styles.canvas}
        style={interactive ? undefined : { cursor: "default" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onKeyDown={handleKeyDown}
      />

      {hud ? (
        <>
          <div className={`${styles.hud} ${styles.hudTop}`} aria-hidden="true">
            <span ref={headingRef}>N 000°</span>
            {label ? <span>{label}</span> : null}
          </div>
          <div className={`${styles.hud} ${styles.hudBottom}`} aria-hidden="true">
            <span>{interactive ? hint : ""}</span>
            <span>{`seed ${String(seed).padStart(5, "0")}`}</span>
          </div>
        </>
      ) : null}
    </div>
  );
}
