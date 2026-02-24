// Wave Field — fullscreen background shader
export const waveFieldVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const waveFieldFragment = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform float uCoherence;
uniform vec2 uMouse;
uniform float uLoopT;
uniform float uZoom;

varying vec2 vUv;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = r * p * 2.0;
    a *= 0.5;
  }
  return v;
}

float lattice(vec2 p) {
  vec2 g = fract(p) - 0.5;
  float d = min(abs(g.x), abs(g.y));
  float lines = smoothstep(0.0, 0.10, d);
  // Add subtle dot at intersections
  vec2 id = floor(p);
  float dot_pulse = sin(id.x * 3.7 + id.y * 5.3 + p.x * 0.5) * 0.5 + 0.5;
  float dot_mask = 1.0 - smoothstep(0.0, 0.18, length(g)) * dot_pulse * 0.3;
  return lines * dot_mask;
}

float packet(vec2 uv, vec2 orig, vec2 dir, float age, float spd, float frq) {
  vec2 nd = normalize(dir);
  vec2 d = uv - orig;
  float along = dot(d, nd);
  float rad = length(d - nd * along);
  float front = along - age * spd;
  float envelope = exp(-rad * rad * 3.5) * exp(-front * front * 2.5);
  float wave = sin(frq * front - age * 5.0);
  return envelope * wave * smoothstep(0.0, 0.06, age) * smoothstep(0.35, 0.28, age / 12.5);
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  float asp = uResolution.x / uResolution.y;
  uv.x *= asp;

  // Camera zoom (cinematic push-in during fusion)
  uv /= uZoom;

  // Parallax drift
  uv += uMouse * 0.035;

  // Side blend: left = human (organic), right = AI (geometric)
  float side = smoothstep(-0.10, 0.10, uv.x);
  float t = uTime;

  // Organic field (human side)
  float organic = fbm(uv * 1.4 + vec2(t * 0.10, t * 0.07)) * 2.0 - 1.0;
  // Add secondary turbulence layer
  organic += fbm(uv * 2.8 - t * 0.06) * 0.3;

  // Geometric field (AI side)
  float geometric = lattice(uv * 1.8 + vec2(t * 0.06, t * 0.04)) * 2.0 - 1.0;
  // Add pulsing grid intensity
  geometric *= 0.8 + 0.2 * sin(t * 0.3 + uv.y * 1.5);

  float base = mix(organic, geometric, side);

  // === Wave packets (exchange phase: 0.30–0.65 loopT) ===
  float w = 0.0;
  for (int i = 0; i < 14; i++) {
    float fi = float(i);
    float spawnT = 0.28 + fi * 0.025;
    float age = uLoopT - spawnT;
    if (age < 0.0 || age > 0.38) continue;

    float dr = mod(fi, 2.0) * 2.0 - 1.0;
    float yOff = (hash21(vec2(fi, 42.0)) - 0.5) * 1.8;
    float curve = sin(fi * 1.7 + fi * 0.3) * 0.3;
    float speed = 1.6 + hash21(vec2(fi, 17.0)) * 0.6;
    float freq = 6.0 + fi * 0.4;

    vec2 origin = vec2(-dr * (asp + 0.3), yOff);
    vec2 direction = vec2(dr, curve);
    w += packet(uv, origin, direction, age * 12.5, speed, freq) * 0.55;
  }

  float field = base + w * 0.75;

  // Coherence sharpening — structure emerges
  float sharpPow = 1.0 + uCoherence * 1.0;
  field = mix(field, sign(field) * pow(abs(field), sharpPow), uCoherence);

  // === Color system ===
  vec3 warmCore = vec3(0.83, 0.38, 0.42);   // #D4616B coral
  vec3 warmGlow = vec3(0.95, 0.75, 0.68);   // #F2C1AE light coral
  vec3 coolCore = vec3(0.48, 0.38, 1.0);    // #7B61FF bio-electric
  vec3 coolGlow = vec3(0.75, 0.52, 0.99);   // #BDA6FF lavender

  vec3 warm = mix(warmCore, warmGlow, smoothstep(0.3, 0.8, abs(field)));
  vec3 cool = mix(coolCore, coolGlow, smoothstep(0.3, 0.8, abs(field)));

  vec3 col = mix(warm, cool, side);
  // Blended center during coherence
  vec3 fusionCol = vec3(0.78, 0.58, 0.92);
  col = mix(col, fusionCol, uCoherence * 0.25 * (1.0 - abs(uv.x) * 0.5));

  // Intensity from field structure
  float inten = 0.05 + 0.24 * smoothstep(0.04, 0.65, abs(field));

  // Center glow during emergence
  float centerDist = length(uv * vec2(0.7, 1.0));
  float ctrGlow = exp(-centerDist * centerDist * 0.6) * uCoherence * 0.14;

  // Boundary glow during exchange (where worlds meet)
  float boundaryGlow = exp(-uv.x * uv.x * 8.0) * abs(w) * 0.3;

  // === Background ===
  vec3 bgTop = vec3(0.031, 0.024, 0.071);    // #080612
  vec3 bgBot = vec3(0.055, 0.031, 0.133);    // #0E0822
  vec3 bg = mix(bgBot, bgTop, vUv.y);

  // Auras: warm left, cool right
  float leftAura = exp(-(pow(uv.x + 0.7, 2.0) * 1.8 + uv.y * uv.y * 0.4)) * 0.08;
  float rightAura = exp(-(pow(uv.x - 0.7, 2.0) * 1.8 + uv.y * uv.y * 0.4)) * 0.06;
  bg += warmCore * leftAura + coolCore * rightAura;

  // === Composite ===
  vec3 fin = bg + col * inten + vec3(ctrGlow) + col * boundaryGlow;

  // Loop transition: subtle fade at boundaries
  float loopFade = smoothstep(0.96, 1.0, uLoopT) + smoothstep(0.04, 0.0, uLoopT);
  fin *= 1.0 - loopFade * 0.45;

  // Vignette — theatre focus
  float vig = 1.0 - dot(vUv - 0.5, vUv - 0.5) * 1.4;
  fin *= smoothstep(0.0, 0.65, vig);

  // Film grain (very subtle)
  float grain = (hash21(vUv * 800.0 + fract(t) * 100.0) - 0.5) * 0.025;
  fin += grain;

  // Filmic tonemap (ACES approximation)
  fin = fin * (2.51 * fin + 0.03) / (fin * (2.43 * fin + 0.59) + 0.14);

  gl_FragColor = vec4(clamp(fin, 0.0, 1.0), 1.0);
}
`;

// Particle vertex — instanced points
export const particleVertex = /* glsl */ `
attribute float aSize;
attribute float aType;
attribute float aEnergy;

varying float vType;
varying float vEnergy;

uniform float uPixelRatio;

void main() {
  vType = aType;
  vEnergy = aEnergy;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uPixelRatio * (28.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;

// Particle fragment — soft glowing circle
export const particleFragment = /* glsl */ `
precision highp float;

varying float vType;
varying float vEnergy;

void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  if (d > 1.0) discard;

  float alpha = (1.0 - d * d) * vEnergy * 0.4;

  // Human: warm coral, AI: cool violet
  vec3 warm = vec3(0.91, 0.55, 0.48);
  vec3 cool = vec3(0.56, 0.46, 1.0);
  vec3 col = mix(warm, cool, vType);

  // Core glow (brighter center)
  col += exp(-d * 3.5) * col * 0.5;

  gl_FragColor = vec4(col, alpha);
}
`;
