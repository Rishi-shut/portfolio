import { useEffect, useRef } from "react";
import {
  Renderer,
  Camera,
  Transform,
  Mesh,
  Program,
  Geometry,
  Vec3,
  Mat4,
} from "ogl";
import { useMood } from "../context/MoodContext";
import { blendCoeffs } from "../shader/moods";

const KEYS = [
  [
    [2.8, 0.9],
    [3.6, -1.6],
    [-4.2, -1.2],
    [-3.4, 1.8],
  ],
  [
    [1.0, 0.6],
    [-1.2, -0.5],
    [1.4, -1.2],
    [-1.5, 1.1],
  ],
  [
    [3.8, 1.6],
    [-3.8, 1.2],
    [3.2, -1.8],
    [-3.2, -1.6],
  ],
  [
    [-3.2, 2.2],
    [-1.1, 2.5],
    [1.1, 2.4],
    [3.2, 2.2],
  ],
];

const SCALES = [1.7, 1.25, 1.5, 1.05];

const FLYER_KEYS = [
  [2.4, 1.7, -6.5],
  [0.4, 0.3, -2.4],
  [-0.3, -0.2, 3.4],
  [-2.6, -1.4, -5.5],
];
const FLYER_SCALE = 2.1;

const VERT = `
  attribute vec3 position;
  attribute vec3 normal;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat3 normalMatrix;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = `
  precision highp float;
  varying vec3 vNormal;
  varying vec3 vView;
  uniform vec3 uTint;
  uniform float uBoost;
  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vView);
    float d = length(vView);
    float fr = pow(1.0 - abs(dot(n, v)), 1.55);
    vec3 col = mix(vec3(0.03, 0.04, 0.06), uTint, 0.28 + 0.72 * fr);
    float spec = pow(max(dot(reflect(-v, n), normalize(vec3(0.4, 0.9, 0.5))), 0.0), 22.0);
    col += uTint * spec * 1.0;
    col += uTint * uBoost * 0.16;
    float a = (0.34 + 0.66 * fr) * (1.0 + uBoost * 0.9);
    a *= smoothstep(24.0, 3.5, d);
    gl_FragColor = vec4(col, a);
  }
`;

function icoTriangles() {
  const t = (1 + Math.sqrt(5)) / 2;
  const raw = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ];
  const verts = raw.map(([x, y, z]) => {
    const l = Math.hypot(x, y, z);
    return [x / l, y / l, z / l];
  });
  const faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];
  const out = [];
  for (const [a, b, c] of faces) {
    out.push([verts[a], verts[b], verts[c]]);
  }
  return out;
}

function flatGeometry(gl) {
  const tris = icoTriangles();
  const outPos = [];
  const outNor = [];
  for (const [a, b, c] of tris) {
    const e1x = b[0] - a[0], e1y = b[1] - a[1], e1z = b[2] - a[2];
    const e2x = c[0] - a[0], e2y = c[1] - a[1], e2z = c[2] - a[2];
    let nx = e1y * e2z - e1z * e2y;
    let ny = e1z * e2x - e1x * e2z;
    let nz = e1x * e2y - e1y * e2x;
    const len = Math.hypot(nx, ny, nz) || 1;
    nx /= len; ny /= len; nz /= len;
    outPos.push(...a, ...b, ...c);
    outNor.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
  }
  return new Geometry(gl, {
    position: { data: new Float32Array(outPos), size: 3 },
    normal: { data: new Float32Array(outNor), size: 3 },
  });
}

export default function PrismScene({ chipA, chipB }) {
  const canvasRef = useRef(null);
  const mood = useMood();
  const engine = mood.engine;

  useEffect(() => {
    const canvas = canvasRef.current;
    let renderer;
    try {
      renderer = new Renderer({
        canvas,
        alpha: true,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      });
    } catch {
      return;
    }
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 42, near: 0.1, far: 60 });
    camera.position.set(0, 0, 9);

    const scene = new Transform();
    const tintU = { value: new Vec3(...blendCoeffs(engine.current).tint) };
    const geometry = flatGeometry(gl);

    function makeProgram(boostable) {
      return new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        transparent: true,
        depthWrite: false,
        cullFace: null,
        uniforms: {
          uTint: tintU,
          uBoost: { value: 0 },
        },
      });
    }

    const meshes = [];
    for (let i = 0; i < KEYS.length; i++) {
      const program = makeProgram();
      const mesh = new Mesh(gl, { geometry, program });
      mesh.setParent(scene);
      const s = SCALES[i];
      mesh.scale.set(s, s * 1.55, s);
      mesh.userData = { keys: KEYS[i], rs: 0.16 + i * 0.03, phase: i * 1.7 };
      meshes.push(mesh);
    }

    let flyer;
    const flyerProgram = makeProgram();
    flyer = new Mesh(gl, { geometry, program: flyerProgram });
    flyer.setParent(scene);
    const fs = FLYER_SCALE;
    flyer.scale.set(fs, fs * 1.45, fs);
    flyer.userData = { keys: FLYER_KEYS, rs: 0.12, phase: 2.4 };
    meshes.push(flyer);

    const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.perspective({ aspect: window.innerWidth / window.innerHeight });
    };
    window.addEventListener("resize", onResize);
    onResize();

    const v = new Vec3();
    const vp = new Mat4();

    function updateChip(ref, i, name) {
      const el = ref.current;
      if (!el) return;
      const m = meshes[i];
      v.set(m.position.x, m.position.y, 0);
      vp.multiply(camera.projectionMatrix, camera.viewMatrix);
      v.applyMatrix4(vp);
      const px = (v.x * 0.5 + 0.5) * window.innerWidth;
      const py = (-v.y * 0.5 + 0.5) * window.innerHeight;
      el.style.transform = `translate(${px + 14}px, ${py - 10}px)`;
      const span = el.querySelector("span");
      if (span) {
        const deg = Math.round(((m.rotation.y * 180) / Math.PI) % 360);
        span.textContent = `${name} · X ${m.position.x.toFixed(2)} · Y ${m.position.y.toFixed(2)} · ${deg}°`;
      }
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    let t = Math.random() * 10;
    let acc = 0;

    function frame(now) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000 || 0.016, 0.05);
      last = now;
      if (document.hidden) return;
      if (reduce) return;
      t += dt;
      mouse.sx += (mouse.x - mouse.sx) * (1 - Math.exp(-dt * 4));
      mouse.sy += (mouse.y - mouse.sy) * (1 - Math.exp(-dt * 4));

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      const seg = p * (KEYS.length - 1);
      const ki = Math.min(Math.floor(seg), KEYS.length - 2);
      let f = seg - ki;
      f = f * f * (3 - 2 * f);

      const coeffs = blendCoeffs(engine.current);
      tintU.value.set(coeffs.tint[0], coeffs.tint[1], coeffs.tint[2]);

      const camZ = 9 - 15 * p;
      camera.position.set(
        mouse.sx * 0.4 + Math.sin(p * Math.PI * 2) * 0.5,
        -mouse.sy * 0.3 + Math.cos(p * Math.PI * 2) * 0.35,
        camZ
      );
      camera.rotation.z = Math.sin(p * Math.PI) * 0.05;
      camera.updateMatrixWorld();

      for (const m of meshes) {
        const u = m.userData;
        const A = u.keys[ki];
        const B = u.keys[ki + 1];
        m.position.x = A[0] + (B[0] - A[0]) * f;
        m.position.y = A[1] + (B[1] - A[1]) * f + Math.sin(t * 0.55 + u.phase) * 0.16;
        m.position.z = (A[2] || 0) + ((B[2] || 0) - (A[2] || 0)) * f;
        const dist = Math.abs(m.position.z - camZ);
        const boost = 1 + 2.2 * Math.max(0, 1 - dist / 5);
        m.rotation.x += dt * u.rs * boost * 0.55;
        m.rotation.y += dt * u.rs * boost + mouse.sx * dt * 0.4;
        if (m.program.uniforms.uBoost) {
          m.program.uniforms.uBoost.value = Math.max(0, 1 - Math.abs(m.position.z - 1.1) / 2.4);
        }
      }

      renderer.render({ scene, camera });

      acc += dt;
      if (acc > 0.12) {
        acc = 0;
        updateChip(chipA, 0, "SHARD_01");
        updateChip(chipB, 4, "SHARD_05");
      }
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [engine, chipA, chipB]);

  return <canvas ref={canvasRef} className="prism-canvas" aria-hidden="true" />;
}
