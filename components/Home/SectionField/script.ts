import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three'

const COUNT = 24000
const SECTION_IDS = [
  'leadership',
  'projects',
  'case-study',
  'experience',
  'approach',
  'vibe',
  'contact',
] as const
const FORMATIONS = [
  'leadership',
  'projects',
  'devices',
  'timeline',
  'architecture',
  'sound',
  'contact',
] as const

type Formation = (typeof FORMATIONS)[number]

interface SectionComposition {
  x: number
  y: number
  scale: number
  pointSize: number
  lightOpacity: number
  darkOpacity: number
}

const SECTION_COMPOSITIONS: readonly SectionComposition[] = [
  { x: 0, y: 0.65, scale: 1.06, pointSize: 2.85, lightOpacity: 0.13, darkOpacity: 0.09 },
  { x: 0, y: -0.35, scale: 0.95, pointSize: 2.65, lightOpacity: 0.11, darkOpacity: 0.08 },
  { x: -0.3, y: 0.65, scale: 1.17, pointSize: 3.15, lightOpacity: 0.3, darkOpacity: 0.22 },
  { x: 0, y: 0.2, scale: 0.9, pointSize: 2.8, lightOpacity: 0.1, darkOpacity: 0.075 },
  { x: 0, y: -0.1, scale: 0.76, pointSize: 2.6, lightOpacity: 0.085, darkOpacity: 0.065 },
  { x: 0, y: 0, scale: 0.86, pointSize: 2.55, lightOpacity: 0.09, darkOpacity: 0.07 },
  { x: 0, y: -0.35, scale: 0.9, pointSize: 2.8, lightOpacity: 0.11, darkOpacity: 0.08 },
]

const write = (array: Float32Array, index: number, x: number, y: number, z: number): void => {
  const offset = index * 3
  array[offset] = x
  array[offset + 1] = y
  array[offset + 2] = z
}

const random = (index: number, salt: number): number => {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453
  return value - Math.floor(value)
}

const buildFormation = (formation: Formation, output: Float32Array): void => {
  for (let index = 0; index < COUNT; index += 1) {
    const r1 = random(index, 1)
    const r2 = random(index, 2)
    const r3 = random(index, 3)
    const r4 = random(index, 4)

    if (formation === 'leadership') {
      if (r1 < 0.84) {
        const progress = index / COUNT
        const y = 1 - progress * 2
        const radius = Math.sqrt(Math.max(0, 1 - y * y))
        const angle = index * Math.PI * (3 - Math.sqrt(5))
        const shell = 4.6 + (r2 - 0.5) * 0.7
        write(
          output,
          index,
          Math.cos(angle) * radius * shell,
          y * shell,
          Math.sin(angle) * radius * shell,
        )
      } else {
        const angle = r2 * Math.PI * 2
        const radius = 6.2 + Math.pow(r3, 2) * 3.2
        write(output, index, Math.cos(angle) * radius, (r4 - 0.5) * 0.48, Math.sin(angle) * radius)
      }
      continue
    }

    if (formation === 'projects') {
      const strand = r2 > 0.5 ? Math.PI : 0
      const angle = r1 * Math.PI * 3.7 + strand
      const radius = 2.25 + Math.sin(r1 * 3.1) * 0.65
      const tubeAngle = r3 * Math.PI * 2
      const tubeRadius = Math.sqrt(r4) * 0.95
      write(
        output,
        index,
        (r1 - 0.5) * 16,
        Math.cos(angle) * radius + Math.cos(tubeAngle) * tubeRadius,
        Math.sin(angle) * radius + Math.sin(tubeAngle) * tubeRadius,
      )
      continue
    }

    if (formation === 'devices') {
      if (r1 < 0.68) {
        write(output, index, -1.5 + (r2 - 0.5) * 7.4, (r3 - 0.5) * 4.7, (r4 - 0.5) * 1.15)
      } else {
        write(output, index, 4.1 + (r2 - 0.5) * 2.25, (r3 - 0.5) * 5.6, (r4 - 0.5) * 1.35)
      }
      continue
    }

    if (formation === 'timeline') {
      const bar = Math.floor(r1 * 5)
      const heights = [2.2, 3.3, 4.1, 5.4, 6.5]
      const height = heights[bar]
      write(
        output,
        index,
        (bar - 2) * 2.05 + (r2 - 0.5) * 1.35,
        -3.4 + r3 * height,
        (r4 - 0.5) * 1.35,
      )
      continue
    }

    if (formation === 'architecture') {
      const graphDepth = Math.floor(r1 * 4)
      const ring = graphDepth * 2.45
      const slots = Math.max(1, Math.floor(Math.pow(2.25, graphDepth) * 2.2))
      const slot = Math.floor(r2 * slots)
      const angle = (slot / slots) * Math.PI * 2 + graphDepth * 0.5
      const nodeX = Math.cos(angle) * ring
      const nodeY = Math.sin(angle) * ring * 0.6
      if (r3 < 0.55 && graphDepth > 0) {
        const parentRing = Math.max(0, ring - 2.45)
        const parentAngle = angle - 0.5
        const parentX = parentRing * Math.cos(parentAngle)
        const parentY = parentRing * Math.sin(parentAngle) * 0.6
        write(
          output,
          index,
          parentX + (nodeX - parentX) * r4,
          parentY + (nodeY - parentY) * r4,
          (r2 - 0.5) * 1.2,
        )
      } else {
        write(output, index, nodeX + (r3 - 0.5) * 0.9, nodeY + (r4 - 0.5) * 0.9, (r2 - 0.5) * 1.7)
      }
      continue
    }

    if (formation === 'sound') {
      const x = (r1 - 0.5) * 15
      const envelope = Math.sin(r1 * Math.PI)
      const soundWave = Math.sin(r1 * Math.PI * 8 + r2 * 1.2) * (0.8 + envelope * 2.6)
      write(output, index, x, soundWave + (r3 - 0.5) * 1.1, (r4 - 0.5) * 2.2)
      continue
    }

    const phi = r1 * Math.PI * 2
    const cosine = r2 * 2 - 1
    const sine = Math.sqrt(Math.max(0, 1 - cosine * cosine))
    const streak = r4 > 0.9
    const radius = streak ? 2.1 + Math.pow(r3, 2.3) * 12 : 1.9 + Math.pow(r3, 3) * 0.7
    write(
      output,
      index,
      sine * Math.cos(phi) * radius,
      cosine * radius,
      sine * Math.sin(phi) * radius,
    )
  }
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uWave;
  uniform float uPointSize;
  uniform float uFormation;
  varying float vHeat;

  mat2 rotate2d(float angle) {
    float sine = sin(angle);
    float cosine = cos(angle);
    return mat2(cosine, -sine, sine, cosine);
  }

  void main() {
    vec3 p = position;
    float motion = 0.0;

    // Leadership: a stable core with an orbit of influence.
    if (uFormation < 0.5) {
      p.xz = rotate2d(uTime * 0.14) * p.xz;
      float breath = sin(uTime * 1.15 + length(position) * 0.7) * 0.1;
      p += normalize(p + vec3(0.0001)) * breath;
      motion = breath * 3.0;
    }
    // Projects: two product streams carry energy in opposite directions.
    else if (uFormation < 1.5) {
      float flow = sin(position.x * 0.82 - uTime * 1.9 + position.z * 1.7);
      p.y += flow * 0.28;
      p.z += cos(position.x * 0.48 - uTime) * 0.2;
      motion = flow * 0.5 + 0.5;
    }
    // Case study: desktop and phone gently separate and reunite.
    else if (uFormation < 2.5) {
      float deviceSway = sin(uTime * 0.85 + step(1.4, position.x) * 1.8);
      p.y += deviceSway * 0.16;
      p.x += step(1.4, position.x) * deviceSway * 0.14;
      motion = deviceSway * 0.5 + 0.5;
    }
    // Experience: ascending columns breathe at different phases.
    else if (uFormation < 3.5) {
      float columnPulse = sin(uTime * 1.4 + floor((position.x + 5.0) / 2.05) * 0.8);
      p.y += (position.y + 3.5) * columnPulse * 0.045;
      motion = columnPulse * 0.5 + 0.5;
    }
    // Approach: connected systems orbit their common centre.
    else if (uFormation < 4.5) {
      float orbit = 0.055 * sin(uTime * 0.65);
      p.xy = rotate2d(orbit) * p.xy;
      p.z += sin(uTime * 1.2 + length(position.xy)) * 0.3;
      motion = sin(uTime + length(position.xy)) * 0.5 + 0.5;
    }
    // Vibe: an equalizer responds like a playing track.
    else if (uFormation < 5.5) {
      float beat = sin(position.x * 1.4 - uTime * 3.2) * 0.5 + 0.5;
      p.y *= 0.88 + beat * 0.22;
      p.z += beat * 0.38;
      motion = sin(position.x * 0.5 - uTime) * 0.5 + 0.5;
    }
    // Contact: a dense core sends repeating outward streaks.
    else {
      float pulse = sin(length(position) * 1.15 - uTime * 2.8);
      p += normalize(position + vec3(0.0001)) * pulse * 0.28;
      p.xz = rotate2d(uTime * 0.08) * p.xz;
      motion = pulse * 0.5 + 0.5;
    }

    float radius = length(p.xy);
    float wave = sin(radius * 2.2 - uTime * 5.5) * uWave;
    p.xy += normalize(p.xy + vec2(0.0001)) * wave;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = max(1.0, uPointSize * (20.0 / max(-mv.z, 1.0)));
    vHeat = clamp(abs(wave) * 1.8 + motion * 0.72 + (position.z + 5.0) * 0.025, 0.0, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uPrimary;
  uniform vec3 uSecondary;
  uniform float uOpacity;
  varying float vHeat;

  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float distanceToCenter = length(center);
    if (distanceToCenter > 0.5) discard;
    float alpha = smoothstep(0.5, 0.12, distanceToCenter) * uOpacity;
    gl_FragColor = vec4(mix(uPrimary, uSecondary, vHeat), alpha);
  }
`

export default defineComponent({
  name: 'HomeSectionField',
  setup() {
    const canvasRef = ref<HTMLCanvasElement | null>(null)
    let renderer: WebGLRenderer | null = null
    let camera: PerspectiveCamera | null = null
    let scene: Scene | null = null
    let geometry: BufferGeometry | null = null
    let material: ShaderMaterial | null = null
    let particles: Points | null = null
    let frame = 0
    let resizeObserver: ResizeObserver | null = null
    let themeObserver: MutationObserver | null = null
    let activeIndex = 0
    let wave = 0
    let pointerX = 0
    let pointerY = 0
    const positions = new Float32Array(COUNT * 3)
    const targets = new Float32Array(COUNT * 3)
    const primaryColor = new Color()
    const secondaryColor = new Color()
    const invertedPrimaryColor = new Color()
    const invertedSecondaryColor = new Color()

    const syncTheme = (): void => {
      const styles = getComputedStyle(document.documentElement)
      const themeColors: Array<[Color, string]> = [
        [primaryColor, '--primary-scale-400'],
        [secondaryColor, '--secondary-scale-400'],
        [invertedPrimaryColor, '--primary-scale-300'],
        [invertedSecondaryColor, '--secondary-scale-300'],
      ]

      themeColors.forEach(([color, property]) => {
        const value = styles.getPropertyValue(property).trim()
        if (value) color.set(value)
      })
    }

    const resize = (): void => {
      if (!renderer || !camera) return
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5))
      renderer.setSize(innerWidth, innerHeight, false)
      camera.aspect = innerWidth / innerHeight
      camera.updateProjectionMatrix()
    }

    const updateSection = (): void => {
      const probe = scrollY + innerHeight * 0.34
      let nextIndex = 0
      SECTION_IDS.forEach((id, index) => {
        const section = document.getElementById(id)
        if (section && section.offsetTop <= probe) nextIndex = index
      })
      if (nextIndex === activeIndex) return
      activeIndex = nextIndex
      buildFormation(FORMATIONS[activeIndex], targets)
      wave = 1
    }

    const animate = (time: number): void => {
      if (!renderer || !camera || !scene || !geometry || !material || !particles) return
      updateSection()
      for (let index = 0; index < positions.length; index += 1) {
        positions[index] += (targets[index] - positions[index]) * 0.032
      }
      ;(geometry.getAttribute('position') as BufferAttribute).needsUpdate = true
      wave *= 0.955
      material.uniforms.uTime.value = time * 0.001
      material.uniforms.uWave.value = wave
      material.uniforms.uFormation.value = activeIndex
      const composition = SECTION_COMPOSITIONS[activeIndex]
      const desiredPointSize = composition.pointSize * Math.min(devicePixelRatio || 1, 1.5)
      material.uniforms.uPointSize.value +=
        (desiredPointSize - material.uniforms.uPointSize.value) * 0.04

      const hero = document.getElementById('hero')
      const activation = hero ? hero.offsetTop + hero.offsetHeight * 0.62 : innerHeight * 0.55
      const visibility = Math.min(1, Math.max(0, (scrollY - activation) / 220))
      const isDark = document.documentElement.classList.contains('dark')
      const isCaseStudy = activeIndex === 2
      const sectionOpacity = isDark ? composition.darkOpacity : composition.lightOpacity
      const desiredOpacity = visibility * sectionOpacity
      material.uniforms.uOpacity.value +=
        (desiredOpacity - material.uniforms.uOpacity.value) * 0.065
      material.uniforms.uPrimary.value.lerp(
        isCaseStudy ? invertedPrimaryColor : primaryColor,
        0.055,
      )
      material.uniforms.uSecondary.value.lerp(
        isCaseStudy ? invertedSecondaryColor : secondaryColor,
        0.055,
      )

      const offset = innerWidth >= 900 ? composition.x : 0
      const verticalOffset = composition.y * (innerHeight < 700 ? 0.65 : 1)
      const compositionDriftY = Math.cos(time * 0.00013 + activeIndex * 0.7) * 0.08
      particles.position.x += (offset + pointerX * 0.3 - particles.position.x) * 0.025
      particles.position.y +=
        (verticalOffset + compositionDriftY - pointerY * 0.2 - particles.position.y) * 0.025
      const desiredScale = composition.scale * (innerWidth < 700 ? 0.78 : 1)
      particles.scale.x += (desiredScale - particles.scale.x) * 0.035
      particles.scale.y += (desiredScale - particles.scale.y) * 0.035
      particles.scale.z += (desiredScale - particles.scale.z) * 0.035
      particles.rotation.y = pointerX * 0.05
      particles.rotation.x += (pointerY * 0.025 - particles.rotation.x) * 0.02
      renderer.render(scene, camera)
      frame = requestAnimationFrame(animate)
    }

    const handlePointer = (event: PointerEvent): void => {
      pointerX = event.clientX / innerWidth - 0.5
      pointerY = event.clientY / innerHeight - 0.5
    }

    onMounted(() => {
      const canvas = canvasRef.value
      if (!canvas) return
      scene = new Scene()
      camera = new PerspectiveCamera(44, innerWidth / innerHeight, 0.1, 100)
      camera.position.z = 22
      renderer = new WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      })
      renderer.setClearColor(0, 0)
      geometry = new BufferGeometry()
      buildFormation(FORMATIONS[0], positions)
      buildFormation(FORMATIONS[0], targets)
      geometry.setAttribute('position', new BufferAttribute(positions, 3))
      material = new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uWave: { value: 0 },
          uPointSize: { value: 2.25 * Math.min(devicePixelRatio || 1, 1.5) },
          uFormation: { value: 0 },
          uOpacity: { value: 0 },
          uPrimary: { value: primaryColor.clone() },
          uSecondary: { value: secondaryColor.clone() },
        },
      })
      particles = new Points(geometry, material)
      scene.add(particles)
      syncTheme()
      resize()
      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(document.documentElement)
      themeObserver = new MutationObserver(syncTheme)
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      })
      addEventListener('pointermove', handlePointer, { passive: true })
      frame = requestAnimationFrame(animate)
    })

    onBeforeUnmount(() => {
      cancelAnimationFrame(frame)
      resizeObserver?.disconnect()
      themeObserver?.disconnect()
      removeEventListener('pointermove', handlePointer)
      geometry?.dispose()
      material?.dispose()
      renderer?.dispose()
    })

    return { canvasRef }
  },
})
