import { useState, forwardRef } from 'react'
import { MeshPhysicalMaterial, ShaderChunk } from 'three'
import { useFrame } from '@react-three/fiber'

import { LOOP_DURATION, NOISE_PERIOD_REPEAT } from '../../../lib/config'

import headers from './headers.glsl'
import displacement from './displacement.glsl'

class MagicalMaterialImpl extends MeshPhysicalMaterial {
  constructor(parameters = {}) {
    super(parameters)
    this.setValues(parameters)
    this._time = { value: 0 }
    this._distort = { value: 0 }
    this._radius = { value: 1 }
    this._frequency = { value: 2 }
    this._speed = { value: 0 }

    this._surfaceDistort = { value: 0 }
    this._surfaceFrequency = { value: 0 }
    this._surfaceTime = { value: 0 }
    this._surfaceSpeed = { value: 0 }
    this._numberOfWaves = { value: 5 }
    this._fixNormals = { value: true }
    this._surfacePoleAmount = { value: 1 }
    this._gooPoleAmount = { value: 1 }
    this._noisePeriod = { value: LOOP_DURATION / NOISE_PERIOD_REPEAT }
  }

  onBeforeCompile(shader) {
    shader.uniforms.time = this._time
    shader.uniforms.radius = this._radius
    shader.uniforms.distort = this._distort
    shader.uniforms.frequency = this._frequency
    shader.uniforms.surfaceDistort = this._surfaceDistort
    shader.uniforms.surfaceFrequency = this._surfaceFrequency
    shader.uniforms.surfaceTime = this._surfaceTime
    shader.uniforms.numberOfWaves = this._numberOfWaves
    shader.uniforms.fixNormals = this._fixNormals
    shader.uniforms.surfacePoleAmount = this._surfacePoleAmount
    shader.uniforms.gooPoleAmount = this._gooPoleAmount
    shader.uniforms.noisePeriod = this._noisePeriod

    shader.vertexShader = `
      ${headers}
      ${shader.vertexShader}
    `

    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      `
        void main() {
          ${displacement}
      `
    )

    shader.vertexShader = shader.vertexShader.replace(
      '#include <displacementmap_vertex>',
      `transformed = displacedPosition;`
    )

    // fix normals
    // http://tonfilm.blogspot.com/2007/01/calculate-normals-in-shader.html
    // https://codepen.io/marco_fugaro/pen/xxZWPWJ?editors=1010
    shader.vertexShader = shader.vertexShader.replace(
      '#include <defaultnormal_vertex>',
      ShaderChunk.defaultnormal_vertex.replace(
        'vec3 transformedNormal = objectNormal;',
        `vec3 transformedNormal = displacedNormal;`
      )
    )
  }

  get time() {
    return this._time.value
  }

  set time(v) {
    this._time.value = v
  }

  get distort() {
    return this._distort.value
  }

  set distort(v) {
    this._distort.value = v
  }

  get radius() {
    return this._radius.value
  }

  set radius(v) {
    this._radius.value = v
  }

  get frequency() {
    return this._frequency.value
  }

  set frequency(v) {
    this._frequency.value = v
  }

  get speed() {
    return this._speed.value
  }

  set speed(v) {
    this._speed.value = v
  }

  get surfaceDistort() {
    return this._surfaceDistort.value
  }

  set surfaceDistort(v) {
    this._surfaceDistort.value = v
  }

  get surfaceFrequency() {
    return this._surfaceFrequency.value
  }

  set surfaceFrequency(v) {
    this._surfaceFrequency.value = v
  }

  get surfaceTime() {
    return this._surfaceTime.value
  }

  set surfaceTime(v) {
    this._surfaceTime.value = v
  }

  get surfaceSpeed() {
    return this._surfaceSpeed.value
  }

  set surfaceSpeed(v) {
    this._surfaceSpeed.value = v
  }

  get numberOfWaves() {
    return this._numberOfWaves.value
  }

  set numberOfWaves(v) {
    this._numberOfWaves.value = v
  }

  get fixNormals() {
    return this._fixNormals.value
  }

  set fixNormals(v) {
    this._fixNormals.value = v
  }

  get surfacePoleAmount() {
    return this._surfacePoleAmount.value
  }

  set surfacePoleAmount(v) {
    this._surfacePoleAmount.value = v
  }

  get gooPoleAmount() {
    return this._gooPoleAmount.value
  }

  set gooPoleAmount(v) {
    this._gooPoleAmount.value = v
  }

  get noisePeriod() {
    return this._noisePeriod.value
  }

  set noisePeriod(v) {
    this._noisePeriod.value = v
  }
}

export const MagicalMaterial = forwardRef((props, ref) => {
  const [material] = useState(() => new MagicalMaterialImpl())

  useFrame((_, delta) => {
    // update time with the delta since last frame
    // - this supports rendering at any framerate

    // We don't use clock.getElapsedTime() directly because it looks
    // funny when we animate changes in time with useSpring in Blob.js

    material.time += delta * (material.speed / NOISE_PERIOD_REPEAT)
    material.surfaceTime += delta * (material.surfaceSpeed / NOISE_PERIOD_REPEAT)
  })

  return (
    <primitive
      dispose={undefined}
      object={material}
      ref={ref}
      attach="material"
      {...props}
    />
  )
})

export default MagicalMaterial
