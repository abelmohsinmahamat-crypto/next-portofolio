/*
 * Pure geometry and math helpers for the ink sculpture hero.
 *
 * Everything here is deterministic and free of DOM/browser APIs so it can be
 * unit-tested and shared between renders without importing React.
 */

export const CORE_N = 2800;
export const GRAIN_N = 16000;
export const SPIKE_N = 16;
export const SPHERE_R = 0.3;

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/* Small, fast, seedable PRNG (mulberry32). */
export function mulberry32(seed) {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function easeInOutCubic(t) {
  const value = clamp(t, 0, 1);
  return value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2;
}

export function hexToRgb(hex) {
  let value = String(hex).replace("#", "").trim();

  if (value.length === 3) {
    value = value
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (!/^[0-9a-f]{6}$/i.test(value)) return [0, 0, 0];

  const number = Number.parseInt(value, 16);
  return [(number >> 16) & 255, (number >> 8) & 255, number & 255];
}

export function mixHex(from, to, amount) {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const t = clamp(amount, 0, 1);
  return `rgb(${a.map((channel, index) => Math.round(channel + (b[index] - channel) * t)).join(",")})`;
}

export function rgba(from, to, amount, alpha) {
  return mixHex(from, to, amount).replace("rgb(", "rgba(").replace(")", `,${alpha})`);
}

/* The next seed after a reforge: a Lehmer step kept to five digits for the HUD. */
export function nextSeed(seed) {
  const current = Math.abs(Math.floor(seed)) || 1;
  const value = ((current * 48271 + 11) % 2147483647) % 100000;
  return value === current ? (value + 7919) % 100000 : value;
}

/* Yaw in radians → a compass heading (0–359) for the HUD. */
export function headingOf(yaw) {
  const degrees = Math.round((yaw * 180) / Math.PI) % 360;
  return (degrees + 360) % 360;
}

/*
 * Ink loops + bridges, sampled to a fixed-size point cloud so any two seeds
 * with the same point counts can morph grain-for-grain.
 *
 * Shape: { core, grain, spikes }
 * - core:   Float32Array(coreN * 4) → x, y, z, width per core point
 * - grain:  Float32Array(grainN * 3) → x, y, z per grain particle
 * - spikes: Float32Array(spikeN * 6) → x1, y1, z1, x2, y2, z2 per needle
 */
export function buildCloud(seed, coreN, grainN, spikeN) {
  const random = mulberry32(seed * 2654435761 + 1);

  const unitVector = () => {
    const z = random() * 2 - 1;
    const angle = random() * Math.PI * 2;
    const radius = Math.sqrt(1 - z * z);
    return [radius * Math.cos(angle), radius * Math.sin(angle), z];
  };

  const cross = (a, b) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];

  const normalize = (vector) => {
    const length = Math.hypot(vector[0], vector[1], vector[2]) || 1;
    return [vector[0] / length, vector[1] / length, vector[2] / length];
  };

  /* Polylines: x, y, z, width per vertex. */
  const curves = [];
  const loopCount = 3 + Math.floor(random() * 2);
  const baseWidth = 0.092;

  for (let loop = 0; loop < loopCount; loop += 1) {
    const normal = unitVector();
    const tangentA = normalize(cross(normal, Math.abs(normal[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]));
    const tangentB = cross(normal, tangentA);
    const phase = Array.from({ length: 8 }, () => random() * Math.PI * 2);
    const radius = 0.9 + random() * 0.16;
    const points = [];
    const resolution = 220;

    for (let index = 0; index <= resolution; index += 1) {
      const t = (index / resolution) * Math.PI * 2;
      const ringRadius =
        radius *
        (1 +
          0.15 * Math.sin(2 * t + phase[0]) +
          0.07 * Math.sin(3 * t + phase[1]) +
          0.04 * Math.sin(5 * t + phase[2]));
      const height = radius * (0.24 * Math.sin(2 * t + phase[3]) + 0.08 * Math.sin(3 * t + phase[4]));
      const cos = Math.cos(t) * ringRadius;
      const sin = Math.sin(t) * ringRadius;
      const width =
        baseWidth *
        (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(3 * t + phase[5])) ** 1.5) *
        (0.72 + 0.28 * Math.sin(7 * t + phase[6]));

      points.push(
        tangentA[0] * cos + tangentB[0] * sin + normal[0] * height,
        tangentA[1] * cos + tangentB[1] * sin + normal[1] * height,
        tangentA[2] * cos + tangentB[2] * sin + normal[2] * height,
        Math.max(0.018, width),
      );
    }

    curves.push(points);
  }

  /* Bridges: bowed tubes between two loops, thick in the middle. */
  for (let bridge = 0; bridge < 3; bridge += 1) {
    const curveA = curves[Math.floor(random() * loopCount)];
    const curveB = curves[Math.floor(random() * loopCount)];
    const offsetA = Math.floor(random() * (curveA.length / 4)) * 4;
    const offsetB = Math.floor(random() * (curveB.length / 4)) * 4;
    const start = [curveA[offsetA], curveA[offsetA + 1], curveA[offsetA + 2]];
    const end = [curveB[offsetB], curveB[offsetB + 1], curveB[offsetB + 2]];
    const midpoint = normalize([
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2,
      (start[2] + end[2]) / 2,
    ]);
    const lift = 1.08 + random() * 0.18;
    const control = [midpoint[0] * lift, midpoint[1] * lift, midpoint[2] * lift];
    const points = [];

    for (let index = 0; index <= 40; index += 1) {
      const t = index / 40;
      const inverse = 1 - t;
      points.push(
        inverse * inverse * start[0] + 2 * inverse * t * control[0] + t * t * end[0],
        inverse * inverse * start[1] + 2 * inverse * t * control[1] + t * t * end[1],
        inverse * inverse * start[2] + 2 * inverse * t * control[2] + t * t * end[2],
        baseWidth * (0.16 + 0.42 * Math.sin(Math.PI * t)),
      );
    }

    curves.push(points);
  }

  /* Resample every curve by arc length into exactly coreN core points. */
  const segments = [];
  let totalLength = 0;

  for (const curve of curves) {
    for (let index = 0; index + 4 < curve.length; index += 4) {
      const length = Math.hypot(
        curve[index + 4] - curve[index],
        curve[index + 5] - curve[index + 1],
        curve[index + 6] - curve[index + 2],
      );

      segments.push({ curve, index, length });
      totalLength += length;
    }
  }

  const core = new Float32Array(coreN * 4);
  const tangents = new Float32Array(coreN * 3);
  let segmentIndex = 0;
  let accumulated = 0;

  for (let point = 0; point < coreN; point += 1) {
    const target = ((point + 0.5) / coreN) * totalLength;

    while (segmentIndex < segments.length - 1 && accumulated + segments[segmentIndex].length < target) {
      accumulated += segments[segmentIndex].length;
      segmentIndex += 1;
    }

    const { curve, index, length } = segments[segmentIndex];
    const fraction = length ? clamp((target - accumulated) / length, 0, 1) : 0;

    for (let component = 0; component < 4; component += 1) {
      core[point * 4 + component] =
        curve[index + component] + (curve[index + 4 + component] - curve[index + component]) * fraction;
    }

    tangents.set(
      normalize([
        curve[index + 4] - curve[index],
        curve[index + 5] - curve[index + 1],
        curve[index + 6] - curve[index + 2],
      ]),
      point * 3,
    );
  }

  /* Grain: inside and just past each tube's skin, plus a little loose dust. */
  const grain = new Float32Array(grainN * 3);

  for (let particle = 0; particle < grainN; particle += 1) {
    const point = Math.floor(random() * coreN);
    const tangent = [tangents[point * 3], tangents[point * 3 + 1], tangents[point * 3 + 2]];
    const direction = unitVector();
    const dot = direction[0] * tangent[0] + direction[1] * tangent[1] + direction[2] * tangent[2];
    const orthogonal = normalize([
      direction[0] - dot * tangent[0],
      direction[1] - dot * tangent[1],
      direction[2] - dot * tangent[2],
    ]);
    const width = core[point * 4 + 3];
    const isDust = random() < 0.05;
    const radius = isDust ? width * (1.3 + random() * 1.6) : width * (0.35 + 0.82 * Math.sqrt(random()));

    for (let component = 0; component < 3; component += 1) {
      grain[particle * 3 + component] = core[point * 4 + component] + orthogonal[component] * radius;
    }
  }

  /* Spikes: thin needles bristling outward. */
  const spikes = new Float32Array(spikeN * 6);

  for (let spike = 0; spike < spikeN; spike += 1) {
    const point = Math.floor(random() * coreN);
    const origin = [core[point * 4], core[point * 4 + 1], core[point * 4 + 2]];
    const jitter = unitVector();
    const direction = normalize([
      origin[0] + jitter[0] * 0.45,
      origin[1] + jitter[1] * 0.45,
      origin[2] + jitter[2] * 0.45,
    ]);
    const length = 0.18 + random() * 0.42;

    spikes.set(
      [
        origin[0],
        origin[1],
        origin[2],
        origin[0] + direction[0] * length,
        origin[1] + direction[1] * length,
        origin[2] + direction[2] * length,
      ],
      spike * 6,
    );
  }

  return { core, grain, spikes };
}

/*
 * Yaw about Y, then pitch about X. Returns screen x, y, depth and scale.
 */
export function project(x, y, z, yaw, pitch, focal) {
  const cosYaw = Math.cos(yaw);
  const sinYaw = Math.sin(yaw);
  const x1 = x * cosYaw + z * sinYaw;
  const z1 = -x * sinYaw + z * cosYaw;
  const cosPitch = Math.cos(pitch);
  const sinPitch = Math.sin(pitch);
  const y2 = y * cosPitch - z1 * sinPitch;
  const z2 = y * sinPitch + z1 * cosPitch;
  const scale = focal / (focal - z2);

  return [x1 * scale, y2 * scale, z2, scale];
}
