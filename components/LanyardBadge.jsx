"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { supportsWebGL2 } from "@/lib/webgl";
import styles from "./LanyardBadge.module.css";

/*
 * Three.js is only needed on the client and is quite heavy, so the badge is
 * loaded as its own chunk after hydration. The static card below is rendered
 * on the server (and kept as a fallback when WebGL is unavailable).
 */
const Lanyard = dynamic(() => import("./Lanyard"), { ssr: false });

const CARD_WIDTH = 1024;
const CARD_HEIGHT = 1440;
const SANS = '"Segoe UI", "Helvetica Neue", Arial, sans-serif';
const MONO = '"Cascadia Mono", "SFMono-Regular", Consolas, monospace';
const INK = "#f4f6fb";
const GOLD = "#fbbf24";
const MUTED = "rgba(244, 246, 251, 0.56)";

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function paintBase(ctx) {
  ctx.fillStyle = "#080d19";
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  const gold = ctx.createRadialGradient(860, 110, 0, 860, 110, 720);
  gold.addColorStop(0, "rgba(251, 191, 36, 0.2)");
  gold.addColorStop(1, "rgba(251, 191, 36, 0)");
  ctx.fillStyle = gold;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  const violet = ctx.createRadialGradient(120, 1280, 0, 120, 1280, 780);
  violet.addColorStop(0, "rgba(139, 123, 255, 0.18)");
  violet.addColorStop(1, "rgba(139, 123, 255, 0)");
  ctx.fillStyle = violet;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
  ctx.lineWidth = 1;
  for (let x = 64; x < CARD_WIDTH; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, CARD_HEIGHT);
    ctx.stroke();
  }
  for (let y = 64; y < CARD_HEIGHT; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(CARD_WIDTH, y + 0.5);
    ctx.stroke();
  }
}

function drawMeta(ctx, left, right) {
  ctx.fillStyle = GOLD;
  ctx.beginPath();
  ctx.arc(80, 111, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = `500 26px ${MONO}`;
  ctx.letterSpacing = "3px";
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = MUTED;
  ctx.fillText(left, 104, 120);

  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(251, 191, 36, 0.85)";
  ctx.fillText(right, CARD_WIDTH - 72, 120);
  ctx.letterSpacing = "0px";
}

function drawPhoto(ctx, image) {
  const x = 64;
  const y = 400;
  const width = 896;
  const height = 850;
  const radius = 38;

  ctx.save();
  roundedRect(ctx, x, y, width, height, radius);
  ctx.clip();

  const scale = Math.max(width / image.width, height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const drawX = x + (width - drawWidth) / 2;
  const drawY = y - (drawHeight - height) * 0.12;
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);

  const vignette = ctx.createLinearGradient(0, y + height * 0.55, 0, y + height);
  vignette.addColorStop(0, "rgba(8, 13, 25, 0)");
  vignette.addColorStop(1, "rgba(8, 13, 25, 0.55)");
  ctx.fillStyle = vignette;
  ctx.fillRect(x, y, width, height);
  ctx.restore();

  roundedRect(ctx, x, y, width, height, radius);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(251, 191, 36, 0.42)";
  ctx.stroke();
}

function createFrontFace(image) {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  paintBase(ctx);
  drawMeta(ctx, "PORTFOLIO · 2026", "ID 001");

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = INK;
  ctx.font = `700 92px ${SANS}`;
  ctx.letterSpacing = "-2px";
  ctx.fillText(site.name, 70, 286);

  ctx.font = `500 36px ${SANS}`;
  ctx.letterSpacing = "0px";
  ctx.fillStyle = GOLD;
  ctx.fillText(site.role, 72, 344);

  drawPhoto(ctx, image);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(72, 1300.5);
  ctx.lineTo(CARD_WIDTH - 72, 1300.5);
  ctx.stroke();

  ctx.font = `500 24px ${MONO}`;
  ctx.letterSpacing = "2px";
  ctx.fillStyle = "rgba(244, 246, 251, 0.5)";
  ctx.textAlign = "left";
  ctx.fillText("FRONTEND · API · PRODUITS", 72, 1368);

  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(244, 246, 251, 0.68)";
  ctx.fillText(site.githubLabel, CARD_WIDTH - 72, 1368);
  ctx.letterSpacing = "0px";

  return canvas.toDataURL("image/jpeg", 0.94);
}

function createBackFace() {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  paintBase(ctx);
  drawMeta(ctx, "CONTACT", "FULL-STACK");
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  ctx.strokeStyle = "rgba(251, 191, 36, 0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(CARD_WIDTH / 2, 380, 92, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = GOLD;
  ctx.font = `700 96px ${SANS}`;
  ctx.fillText(site.name.charAt(0).toUpperCase(), CARD_WIDTH / 2, 414);

  ctx.fillStyle = INK;
  ctx.font = `600 40px ${SANS}`;
  ctx.fillText(site.role, CARD_WIDTH / 2, 560);

  ctx.font = `600 52px ${SANS}`;
  ctx.letterSpacing = "-1px";
  ctx.fillStyle = "rgba(244, 246, 251, 0.82)";
  const words = site.tagline.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(candidate).width > 780) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  const startY = 700 - (lines.length - 1) * 36;
  lines.forEach((text, index) => ctx.fillText(text, CARD_WIDTH / 2, startY + index * 76));
  ctx.letterSpacing = "0px";

  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(272, 1016.5);
  ctx.lineTo(CARD_WIDTH - 272, 1016.5);
  ctx.stroke();

  ctx.font = `500 22px ${MONO}`;
  ctx.letterSpacing = "3px";
  ctx.fillStyle = MUTED;
  ctx.fillText("RETROUVEZ-MOI SUR GITHUB", CARD_WIDTH / 2, 1084);

  ctx.font = `500 32px ${MONO}`;
  ctx.letterSpacing = "0px";
  ctx.fillStyle = INK;
  ctx.fillText(site.githubLabel, CARD_WIDTH / 2, 1136);

  ctx.font = `500 24px ${MONO}`;
  ctx.letterSpacing = "2px";
  ctx.fillStyle = "rgba(251, 191, 36, 0.8)";
  ctx.fillText("REACT · NEXT.JS · NODE.JS", CARD_WIDTH / 2, 1270);
  ctx.letterSpacing = "0px";

  return canvas.toDataURL("image/jpeg", 0.94);
}

function StaticCard() {
  return (
    <div className={styles.staticBadge}>
      <div className={styles.strap} aria-hidden="true" />
      <div className={styles.card}>
        <div className={styles.cardMeta}>
          <span>PORTFOLIO · 2026</span>
          <span>ID 001</span>
        </div>
        <strong className={styles.cardName}>{site.name}</strong>
        <span className={styles.cardRole}>{site.role}</span>
        <div className={styles.cardPhoto}>
          <Image
            src="/images/portrait.jpg"
            alt={`Portrait de ${site.name}`}
            width={409}
            height={526}
            unoptimized
            preload
            sizes="(max-width: 900px) 60vw, 300px"
            className={styles.cardPhotoImage}
          />
        </div>
        <div className={styles.cardFoot}>
          <span>FRONTEND · API</span>
          <span>{site.githubLabel}</span>
        </div>
      </div>
    </div>
  );
}

export default function LanyardBadge() {
  const [webgl] = useState(() => typeof window !== "undefined" && supportsWebGL2());
  const [faces, setFaces] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const image = new window.Image();
    image.decoding = "async";

    image.onload = () => {
      if (cancelled) return;
      const front = createFrontFace(image);
      const back = createBackFace();
      if (front && back) setFaces({ front, back });
    };

    image.src = "/images/portrait.jpg";

    return () => {
      cancelled = true;
      image.onload = null;
    };
  }, []);

  const ready = webgl && faces !== null;

  return (
    <div className={styles.badge}>
      <div className={styles.glow} aria-hidden="true" />
      {ready ? (
        <div className={styles.stage}>
          <Lanyard
            frontImage={faces.front}
            backImage={faces.back}
            cardColor="#080d19"
            finish="glossy"
            cornerRadius={0.28}
            size={0.68}
            anchor="center"
            strapLength={0.52}
            strapColor="#101a30"
            strapWidth={0.72}
            metal="gold"
            gravity={1}
            damping={0.55}
            elasticity={0.55}
            breeze={0.35}
            interactive
            intro
          />
        </div>
      ) : (
        <StaticCard />
      )}
    </div>
  );
}
