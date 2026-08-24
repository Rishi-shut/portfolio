import { useEffect, useRef, useState } from "react";
import { Renderer, Program, Mesh, Triangle, Vec2, Vec3, Vec4, RenderTarget } from "ogl";
import { useMood } from "../context/MoodContext";
import { MOODS, blendCoeffs } from "../shader/moods";

const VERTEX = `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const WAKE_FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D u_prev;
  uniform vec2 u_pos;
  uniform vec2 u_prevPos;
  uniform float u_strength;
  uniform float u_radius;
  uniform vec2 u_scale;
  uniform float u_decayW;
  uniform float u_decayH;

  float segDist(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
    return length(pa - ba * h);
  }

  void main() {
    vec2 prev = texture2D(u_prev, vUv).rg;
    float w = max(prev.r * u_decayW - 0.0016, 0.0);
    float h = max(prev.g * u_decayH - 0.0006, 0.0);

    vec2 px = (vUv - 0.5) * u_scale;
    vec2 pa = (u_prevPos - 0.5) * u_scale;
    vec2 pb = (u_pos - 0.5) * u_scale;
    float d = segDist(px, pa, pb);
    float splat = exp(-(d * d) / max(u_radius * u_radius, 1e-7)) * u_strength;

    w = max(w, splat);
    h = max(h, splat * 0.85);
    gl_FragColor = vec4(w, h, 0.0, 1.0);
  }
`;

const MAIN_FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D u_wake;
  uniform float u_time;
  uniform float u_grain;
  uniform float u_aspect;
  uniform vec3 u_s0;
  uniform vec3 u_s1;
  uniform vec3 u_s2;
  uniform vec3 u_s3;
  uniform vec3 u_tint;
  uniform vec2 u_pointer;
  uniform float u_press;
  uniform vec4 u_ripples[8];

  vec3 grad(float x) {
    float t = clamp(x, 0.0, 1.0) * 3.0;
    vec3 c = mix(u_s0, u_s1, clamp(t, 0.0, 1.0));
    c = mix(c, u_s2, clamp(t - 1.0, 0.0, 1.0));
    c = mix(c, u_s3, clamp(t - 2.0, 0.0, 1.0));
    return c;
  }

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.55;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 5; i++) {
      v += amp * vnoise(p);
      p = m * p;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    float t = u_time;
    vec2 sc = vec2(u_aspect, 1.0);
    vec2 p0 = (vUv - 0.5) * sc * 1.8;

    vec2 wk = texture2D(u_wake, vUv).rg;
    float wake = wk.r;
    float heat = wk.g;

    vec2 disp = vec2(0.0);
    float rim = 0.0;
    for (int i = 0; i < 8; i++) {
      vec4 rp = u_ripples[i];
      float age = t - rp.z;
      float alive = step(0.0001, rp.w) * step(-1.0, rp.z);
      float radius = age * 0.62;
      vec2 c = (rp.xy - 0.5) * sc * 1.8;
      vec2 dv = p0 - c;
      float d = length(dv) + 1e-4;
      float band = exp(-pow((d - radius) * 9.0, 2.0));
      float att = exp(-age * 1.7) * rp.w * alive;
      disp += (dv / d) * band * att * 0.11;
      rim += band * att;
    }

    vec2 toPtr = u_pointer - p0;
    float ptrD = length(toPtr) + 1e-4;
    float infl = wake * exp(-ptrD * 1.4);
    vec2 dirP = toPtr / ptrD;
    vec2 swirl = vec2(-dirP.y, dirP.x);

    vec2 p = p0 + disp + dirP * infl * 0.30 + swirl * infl * 0.20;

    vec2 q = vec2(fbm(p + 0.06 * t),
                  fbm(p + vec2(5.2, 1.3) - 0.05 * t));
    vec2 r = vec2(fbm(p + 2.6 * q + vec2(1.7, 9.2) + 0.12 * t),
                  fbm(p + 2.6 * q + vec2(8.3, 2.8) - 0.09 * t));
    float f = fbm(p + 2.4 * r);
    f = smoothstep(0.18, 0.88, f);

    float shift = 0.10 * sin(t * 0.06);
    float hueRaw = clamp((q.x - 0.24) * 2.1, 0.0, 1.0);
    float hueF = hueRaw * hueRaw * (3.0 - 2.0 * hueRaw);
    float shade = pow(f, 1.15);

    vec3 col = grad(hueF + shift);
    col *= 0.28 + 1.30 * shade;

    float va = 0.5 * sin(t * 0.043 + q.y * 3.0) + p.y * 0.15;
    mat2 vrot = mat2(cos(va), -sin(va), sin(va), cos(va));
    vec2 vp = vrot * p;
    vp.y *= 2.4;
    float vein = fbm(vp * 1.9 + r.yx + 0.08 * t);
    vein = 1.0 - abs(2.0 * vein - 1.0);
    vein = pow(smoothstep(0.55, 0.99, vein), 2.0);

    float film = smoothstep(0.42, 0.80, f) * smoothstep(0.98, 0.60, f);
    col += u_tint * film * shade * 0.35;

    vec3 veinCol = grad(clamp(hueF + shift + 0.22, 0.0, 1.0));
    col += mix(veinCol, u_tint, 0.35) * vein * (0.25 + 0.75 * shade) * 0.60;

    col += mix(u_tint, vec3(1.0), 0.5) * pow(smoothstep(0.72, 0.99, f), 2.0) * 0.45;
    col += u_s0 * 0.05;

    col += u_tint * (wake * 0.85 + heat * heat * 1.05);
    col += u_tint * rim * 0.55;
    col += u_tint * u_press * 0.10 * exp(-ptrD * 3.5);

    float vig = smoothstep(1.50, 0.32, length(p0));
    col *= mix(0.24, 1.0, vig);

    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = clamp(mix(vec3(luma), col, 1.35), 0.0, 4.0);
    col = col / (1.0 + 0.50 * col);
    float g = hash21(gl_FragCoord.xy + vec2(u_grain)) - 0.5;
    col += g * 0.028;

    gl_FragColor = vec4(col, 1.0);
  }
`;

let lastUITint = "";
let lastUIVeil = "";
function syncUI(coeffs) {
  const t = coeffs.tint;
  const key = `${Math.round(t[0] * 127)},${Math.round(t[1] * 127)},${Math.round(t[2] * 127)}`;
  if (key !== lastUITint) {
    lastUITint = key;
    document.documentElement.style.setProperty(
      "--tint",
      `${Math.round(t[0] * 255)} ${Math.round(t[1] * 255)} ${Math.round(t[2] * 255)}`
    );
  }
  const v = (Math.round(coeffs.veil * 100) / 100).toFixed(2);
  if (v !== lastUIVeil) {
    lastUIVeil = v;
    document.documentElement.style.setProperty("--veil-a", v);
  }
}

export default function ShaderCanvas() {
  const canvasRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const mood = useMood();
  const engine = mood.engine;

  useEffect(() => {
    const canvas = canvasRef.current;
    let renderer;
    try {
      renderer = new Renderer({
        canvas,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        antialias: false,
        alpha: false,
      });
    } catch (err) {
      setFailed(true);
      return;
    }

    const gl = renderer.gl;
    let reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rmListener = (e) => (reduceMotion = e.matches);
    matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", rmListener);

    const geometry = new Triangle(gl);

    const wakeProgram = new Program(gl, {
      vertex: VERTEX,
      fragment: WAKE_FRAG,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        u_prev: { value: null },
        u_pos: { value: new Vec2(0.5, 0.5) },
        u_prevPos: { value: new Vec2(0.5, 0.5) },
        u_strength: { value: 0 },
        u_radius: { value: 0.03 },
        u_scale: { value: new Vec2(1, 1) },
        u_decayW: { value: 0.94 },
        u_decayH: { value: 0.98 },
      },
    });

    const mainProgram = new Program(gl, {
      vertex: VERTEX,
      fragment: MAIN_FRAG,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        u_wake: { value: null },
        u_time: { value: 0 },
        u_grain: { value: 0 },
        u_aspect: { value: 1 },
        u_s0: { value: new Vec3(...MOODS[0].stops[0]) },
        u_s1: { value: new Vec3(...MOODS[0].stops[1]) },
        u_s2: { value: new Vec3(...MOODS[0].stops[2]) },
        u_s3: { value: new Vec3(...MOODS[0].stops[3]) },
        u_tint: { value: new Vec3(...MOODS[0].tint) },
        u_pointer: { value: new Vec2(0, 0) },
        u_press: { value: 0 },
        u_ripples: { value: Array.from({ length: 8 }, () => new Vec4(0.5, 0.5, -100, 0)) },
      },
    });

    const meshWake = new Mesh(gl, { geometry, program: wakeProgram });
    const meshMain = new Mesh(gl, { geometry, program: mainProgram });

    const TRAIL_RES = 512;
    const rtOpts = {
      width: TRAIL_RES,
      height: TRAIL_RES,
      depth: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
    };
    let trailRead = new RenderTarget(gl, rtOpts);
    let trailWrite = new RenderTarget(gl, rtOpts);

    const state = {
      time: Math.random() * 100,
      grainSeed: Math.random() * 100,
      aspect: 1,
      raw: { x: 0.5, y: 0.5, active: false },
      prevRaw: { x: 0.5, y: 0.5 },
      drive: { x: 0.5, y: 0.5, px: 0.5, py: 0.5, press: 0 },
      lastInput: performance.now(),
      ghostEngage: 0,
      rippleCursor: 0,
      hinted: false,
    };

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const area = w * h * (window.devicePixelRatio || 1) ** 2;
      renderer.dpr = Math.min(window.devicePixelRatio || 1, area > 3.2e6 ? 1.5 : 2);
      renderer.setSize(w, h);
      state.aspect = w / h;
      mainProgram.uniforms.u_aspect.value = state.aspect;
      wakeProgram.uniforms.u_scale.value.set(state.aspect, 1);
    }
    window.addEventListener("resize", resize);
    resize();

    syncUI(blendCoeffs(engine.current));

    function spawnRipple(x, y) {
      const ripples = mainProgram.uniforms.u_ripples.value;
      ripples[state.rippleCursor % ripples.length].set(x, y, state.time, 1);
      state.rippleCursor++;
    }

    function markInput() {
      state.lastInput = performance.now();
      state.ghostEngage = 0;
      if (!state.hinted) {
        state.hinted = true;
        document.getElementById("hint")?.classList.add("hidden");
      }
    }

    function onPointer(e) {
      state.prevRaw.x = state.raw.x;
      state.prevRaw.y = state.raw.y;
      state.raw.x = e.clientX / window.innerWidth;
      state.raw.y = 1 - e.clientY / window.innerHeight;
      state.raw.active = true;
      markInput();
    }

    function ghostPath(t) {
      return {
        x: 0.5 + 0.30 * Math.sin(t * 0.31 + 1.7) * Math.cos(t * 0.13),
        y: 0.5 + 0.26 * Math.sin(t * 0.23) * Math.sin(t * 0.17 + 0.6),
      };
    }

    function updateDrive(dt, now) {
      const idleFor = now - state.lastInput;
      const ghosting = !reduceMotion && idleFor > 5000;
      if (ghosting && state.ghostEngage === 0) {
        state.raw.x = state.drive.px;
        state.raw.y = state.drive.py;
        state.ghostEngage = 1e-4;
      }
      if (ghosting) {
        state.ghostEngage = Math.min(state.ghostEngage + dt / 2.5, 1);
        const g = ghostPath(now / 1000);
        state.raw.x = g.x;
        state.raw.y = g.y;
        state.raw.active = true;
      }

      const speed =
        Math.hypot(state.raw.x - state.prevRaw.x, state.raw.y - state.prevRaw.y) /
        Math.max(dt, 1e-4);
      const pressTarget = state.raw.active ? Math.min(speed * 1.1, 1) : 0;
      const engage = ghosting ? state.ghostEngage ** 2 : 1;

      const sm = 1 - Math.exp(-dt * 16);
      state.drive.px = state.drive.x;
      state.drive.py = state.drive.y;
      state.drive.x += (state.raw.x - state.drive.x) * sm;
      state.drive.y += (state.raw.y - state.drive.y) * sm;
      state.drive.press += (pressTarget * engage - state.drive.press) * (1 - Math.exp(-dt * 8));

      state.prevRaw.x = state.raw.x;
      state.prevRaw.y = state.raw.y;

      wakeProgram.uniforms.u_pos.value.set(state.drive.x, state.drive.y);
      wakeProgram.uniforms.u_prevPos.value.set(state.drive.px, state.drive.py);
      wakeProgram.uniforms.u_strength.value = (0.25 + 0.75 * state.drive.press) * engage;
      wakeProgram.uniforms.u_radius.value = 0.026 + 0.02 * state.drive.press;

      mainProgram.uniforms.u_pointer.value.set(
        (state.drive.x - 0.5) * state.aspect * 1.8,
        (state.drive.y - 0.5) * 1.8
      );
      mainProgram.uniforms.u_press.value = state.drive.press;
    }

    let lastNow = performance.now();
    let rafId = 0;

    function frame(now) {
      rafId = requestAnimationFrame(frame);
      const dt = Math.min((now - lastNow) / 1000 || 0.016, 0.05);
      lastNow = now;

      state.time += dt * (reduceMotion ? 0.22 : 1);
      if (!reduceMotion) state.grainSeed = (state.grainSeed + dt * 61) % 997;

      updateDrive(dt, now);

      const coeffs = blendCoeffs(engine.current);
      mainProgram.uniforms.u_s0.value.set(...coeffs.stops[0]);
      mainProgram.uniforms.u_s1.value.set(...coeffs.stops[1]);
      mainProgram.uniforms.u_s2.value.set(...coeffs.stops[2]);
      mainProgram.uniforms.u_s3.value.set(...coeffs.stops[3]);
      mainProgram.uniforms.u_tint.value.set(...coeffs.tint);
      syncUI(coeffs);

      const decayW = Math.pow(0.02, dt);
      const decayH = Math.pow(0.12, dt);
      wakeProgram.uniforms.u_decayW.value = decayW;
      wakeProgram.uniforms.u_decayH.value = decayH;
      wakeProgram.uniforms.u_prev.value = trailRead.texture;

      renderer.render({ scene: meshWake, target: trailWrite });
      const swap = trailRead;
      trailRead = trailWrite;
      trailWrite = swap;

      mainProgram.uniforms.u_time.value = state.time;
      mainProgram.uniforms.u_grain.value = state.grainSeed;
      mainProgram.uniforms.u_wake.value = trailRead.texture;

      renderer.render({ scene: meshMain });
    }
    rafId = requestAnimationFrame(frame);

    const onMove = (e) => onPointer(e);
    const onDown = (e) => {
      onPointer(e);
      spawnRipple(state.raw.x, state.raw.y);
    };
    const onKey = (e) => {
      markInput();
      const moodKey = /^[1-6]$/.exec(e.key);
      if (moodKey && !e.metaKey && !e.ctrlKey && !e.altKey) mood.setMood(Number(moodKey[0]) - 1);
      if (e.code === "Space" && !(e.target instanceof HTMLButtonElement)) spawnRipple(0.5, 0.5);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
      matchMedia("(prefers-reduced-motion: reduce)").removeEventListener("change", rmListener);
      trailRead.dispose?.();
      trailWrite.dispose?.();
      renderer.gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [engine, mood]);

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" />
      {failed && (
        <div className="fallback">
          WebGL is not available in this browser.
          <br />
          The live background needs GPU rendering — try Chrome, Edge, Firefox or Safari.
        </div>
      )}
    </>
  );
}
