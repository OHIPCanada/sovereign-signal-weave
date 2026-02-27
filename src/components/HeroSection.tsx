import * as THREE from "three"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import React, { useMemo, useRef } from "react"
import { motion } from "framer-motion"

type Vec3 = [number, number, number]

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

function EmergentNetwork() {
  const pointsRef = useRef<THREE.Points>(null!)
  const glowRef = useRef<THREE.Points>(null!)
  const linesRef = useRef<THREE.LineSegments>(null!)

  const COUNT = 2200
  const CONNECTION_MAX = 9000
  const CONNECT_DIST = 0.55
  const CONNECT_DIST_SQ = CONNECT_DIST * CONNECT_DIST

  const FIELD_RADIUS = 5.2
  const FIELD_Y = 3.0
  const FIELD_Z = 3.5

  const HUMAN = new THREE.Color("#ffb55f")
  const AI = new THREE.Color("#55d6ff")
  const CORE = new THREE.Color("#eaf6ff")

  const state = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const vel = new Float32Array(COUNT * 3)
    const col = new Float32Array(COUNT * 3)
    const species = new Float32Array(COUNT)
    const seed = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      const isAI = i > COUNT * 0.5
      species[i] = isAI ? 1 : 0
      seed[i] = Math.random() * 1000

      const side = isAI ? 1 : -1
      const x = side * (1.6 + Math.random() * 1.4) + (Math.random() - 0.5) * 1.2
      const y = (Math.random() - 0.5) * FIELD_Y
      const z = (Math.random() - 0.5) * FIELD_Z

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      vel[i * 3] = (Math.random() - 0.5) * 0.02
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02

      const c = isAI ? AI : HUMAN
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }

    return { pos, vel, col, species, seed }
  }, [])

  const pointsGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(state.pos, 3))
    g.setAttribute("color", new THREE.BufferAttribute(state.col, 3))
    return g
  }, [state])

  const glowGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(state.pos, 3))
    g.setAttribute("color", new THREE.BufferAttribute(state.col, 3))
    return g
  }, [state])

  const lines = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const linePos = new Float32Array(CONNECTION_MAX * 2 * 3)
    const lineCol = new Float32Array(CONNECTION_MAX * 2 * 3)
    g.setAttribute("position", new THREE.BufferAttribute(linePos, 3))
    g.setAttribute("color", new THREE.BufferAttribute(lineCol, 3))
    g.setDrawRange(0, 0)
    return { geo: g, linePos, lineCol }
  }, [])

  const pointsMat = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.018,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }, [])

  const glowMat = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }, [])

  const lineMat = useMemo(() => {
    return new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  }, [])

  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime()
    const loop = 12
    const p = (t % loop) / loop

    const attraction = smoothstep(0.2, 0.55, p)
    const networking = smoothstep(0.45, 0.75, p)
    const stabilize = smoothstep(0.7, 0.95, p)

    const centerPull = lerp(0.006, 0.02, attraction) * (1 - 0.35 * stabilize)
    const swirl = lerp(0.002, 0.007, attraction) * (1 - 0.4 * stabilize)
    const jitter = lerp(0.004, 0.0015, stabilize)

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3
      const x = state.pos[ix]
      const y = state.pos[ix + 1]
      const z = state.pos[ix + 2]

      state.vel[ix] += (-x) * centerPull * dt * 60
      state.vel[ix + 1] += (-y) * centerPull * dt * 60
      state.vel[ix + 2] += (-z) * centerPull * dt * 60

      state.vel[ix] += (-y) * swirl * dt * 60
      state.vel[ix + 1] += (x) * swirl * dt * 60

      const s = state.seed[i]
      state.vel[ix] += Math.sin(t * 0.8 + s) * jitter * dt
      state.vel[ix + 1] += Math.cos(t * 0.7 + s * 1.3) * jitter * dt
      state.vel[ix + 2] += Math.sin(t * 0.6 + s * 0.9) * jitter * dt

      const damp = lerp(0.985, 0.962, attraction)
      state.vel[ix] *= damp
      state.vel[ix + 1] *= damp
      state.vel[ix + 2] *= damp

      state.pos[ix] += state.vel[ix]
      state.pos[ix + 1] += state.vel[ix + 1]
      state.pos[ix + 2] += state.vel[ix + 2]

      const rr = Math.sqrt(
        (state.pos[ix] * state.pos[ix]) +
        (state.pos[ix + 1] * state.pos[ix + 1]) * 1.2 +
        (state.pos[ix + 2] * state.pos[ix + 2]) * 1.2
      )
      if (rr > FIELD_RADIUS) {
        state.pos[ix] *= 0.985
        state.pos[ix + 1] *= 0.985
        state.pos[ix + 2] *= 0.985
      }

      const isAI = state.species[i] > 0.5
      const base = isAI ? AI : HUMAN
      const mixToCore = smoothstep(0.55, 0.9, p)
      state.col[ix] = lerp(base.r, CORE.r, mixToCore * 0.75)
      state.col[ix + 1] = lerp(base.g, CORE.g, mixToCore * 0.75)
      state.col[ix + 2] = lerp(base.b, CORE.b, mixToCore * 0.75)
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.geometry.attributes.color.needsUpdate = true
    glowRef.current.geometry.attributes.position.needsUpdate = true
    glowRef.current.geometry.attributes.color.needsUpdate = true

    const effectiveDist = lerp(0.38, CONNECT_DIST, networking)
    const effectiveDistSq = effectiveDist * effectiveDist

    let segCount = 0
    const lp = lines.linePos
    const lc = lines.lineCol

    for (let i = 0; i < COUNT && segCount < CONNECTION_MAX; i += 1) {
      const ix = i * 3
      const ax = state.pos[ix]
      const ay = state.pos[ix + 1]
      const az = state.pos[ix + 2]

      const stride = Math.floor(lerp(10, 4, networking))
      for (let j = i + stride; j < COUNT && segCount < CONNECTION_MAX; j += stride) {
        const jx = j * 3
        const bx = state.pos[jx]
        const by = state.pos[jx + 1]
        const bz = state.pos[jx + 2]

        const dx = ax - bx
        const dy = ay - by
        const dz = az - bz
        const d2 = dx * dx + dy * dy + dz * dz

        if (d2 < effectiveDistSq) {
          const k = segCount * 2 * 3

          lp[k] = ax; lp[k + 1] = ay; lp[k + 2] = az
          lp[k + 3] = bx; lp[k + 4] = by; lp[k + 5] = bz

          const falloff = 1 - clamp01(d2 / effectiveDistSq)
          const ar = state.col[ix]
          const ag = state.col[ix + 1]
          const ab = state.col[ix + 2]
          const br = state.col[jx]
          const bg = state.col[jx + 1]
          const bb = state.col[jx + 2]

          const cr = lerp(ar, br, 0.5) * lerp(0.35, 1.0, falloff)
          const cg = lerp(ag, bg, 0.5) * lerp(0.35, 1.0, falloff)
          const cb = lerp(ab, bb, 0.5) * lerp(0.35, 1.0, falloff)

          lc[k] = cr; lc[k + 1] = cg; lc[k + 2] = cb
          lc[k + 3] = cr; lc[k + 4] = cg; lc[k + 5] = cb

          segCount++
        }
      }
    }

    const posAttr = lines.geo.getAttribute("position") as THREE.BufferAttribute
    const colAttr = lines.geo.getAttribute("color") as THREE.BufferAttribute
    posAttr.needsUpdate = true
    colAttr.needsUpdate = true
    lines.geo.setDrawRange(0, segCount * 2)

    ;(lineMat as THREE.LineBasicMaterial).opacity = lerp(0.06, 0.28, networking) * (1 - 0.25 * stabilize)
    ;(glowMat as THREE.PointsMaterial).opacity = lerp(0.14, 0.26, networking)
    ;(pointsMat as THREE.PointsMaterial).opacity = lerp(0.85, 0.98, networking)
  })

  return (
    <group>
      <lineSegments ref={linesRef} geometry={lines.geo} material={lineMat} />
      <points ref={glowRef} geometry={glowGeo} material={glowMat} />
      <points ref={pointsRef} geometry={pointsGeo} material={pointsMat} />
    </group>
  )
}

function LightBeams() {
  const beams = useMemo(() => {
    const arr: Array<{ pos: Vec3; rot: Vec3; s: Vec3; a: number }> = []
    for (let i = 0; i < 4; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 1.2, -1.2 - Math.random() * 1.2],
        rot: [0, 0, (Math.random() - 0.5) * 0.8],
        s: [2.6 + Math.random() * 1.8, 6.5 + Math.random() * 3, 1],
        a: 0.08 + Math.random() * 0.06,
      })
    }
    return arr
  }, [])

  return (
    <group>
      {beams.map((b, i) => (
        <Float key={i} speed={0.6 + i * 0.15} rotationIntensity={0.08} floatIntensity={0.3}>
          <mesh position={b.pos} rotation={b.rot} scale={b.s}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              color="#7799cc"
              transparent
              opacity={b.a}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <EmergentNetwork />
      <LightBeams />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={1.1}
          luminanceThreshold={0.12}
          luminanceSmoothing={0.7}
          mipmapBlur
        />
        <Vignette offset={0.3} darkness={0.65} blendFunction={BlendFunction.NORMAL} />
      </EffectComposer>
    </>
  )
}

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#080a10]">
      {/* Atmospheric gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 55%, rgba(90,120,200,0.10) 0%, transparent 70%)",
        }}
      />

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 5.5], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Scene />
        </Canvas>
      </div>

      {/* Title */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hero-title text-center text-[clamp(56px,12vw,190px)]"
            style={{
              color: "rgba(230, 235, 255, 0.92)",
              textShadow: "0 0 80px rgba(100,140,255,0.3), 0 0 160px rgba(100,140,255,0.15)",
            }}
          >
            INTELLIGENCE
          </motion.h1>
        </div>
      </div>

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-20 animate-noise"
        style={{
          opacity: 0.04,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to top, #080a10 0%, transparent 100%)",
        }}
      />

      <style>{`
        @keyframes noiseShift {
          0% { transform: translate3d(0,0,0); }
          20% { transform: translate3d(-6%, 4%, 0); }
          40% { transform: translate3d(5%, -7%, 0); }
          60% { transform: translate3d(-8%, -3%, 0); }
          80% { transform: translate3d(7%, 6%, 0); }
          100% { transform: translate3d(0,0,0); }
        }
        .animate-noise {
          animation: noiseShift 3.2s steps(2) infinite;
        }
      `}</style>
    </section>
  )
}
