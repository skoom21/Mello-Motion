import { forwardRef, useRef, useEffect, useMemo, useState } from 'react';
import { useTexture, Sphere } from '@react-three/drei';
import { Vector3, Quaternion } from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { a, useSpring } from '@react-spring/three';
import { mergeRefs } from 'react-merge-refs';

// Local components
import MagicalMaterial from './MagicalMaterial';

import gradient0 from '../../../assets/gradients/cloudconvert/05_gradient-alert.png';

const AnimatedMagicalMaterial = a(MagicalMaterial);

function Blob({ position, ...props }, ref) {
  const material = useRef();
  const blob = useRef();
  const geom = useRef();
  const grabTarget = useRef();
  const { size } = useThree();
  const isPortrait = size.height > size.width;

  const firstLoad = useRef(true);
  const [showAllMaterial, setShowAllMaterial] = useState(false);

  useEffect(() => {
    let timer;
    if (firstLoad.current) timer = setTimeout(() => setShowAllMaterial(true), 500);
    else setShowAllMaterial(true);

    firstLoad.current = false;
    return () => clearTimeout(timer);
  }, []);

  const globalPos = useMemo(() => new Vector3(), []);
  const globalQuaternion = useMemo(() => new Quaternion(), []);

  const gradients = useTexture([gradient0]);
  const [selectedGradient] = useState(gradients[0]);

  const materialSpring = useSpring({
    color: '#fff',
    envMapIntensity: showAllMaterial ? 1 : 0,
    roughness: 0.14,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.7,
    transmission: showAllMaterial ? 0.0 : 0,
    config: { tension: 50, friction: 20, precision: 0.00001 },
  });

  const meshSpring = useSpring({
    scale: [0.14, 0.14, 0.14],
    rotation: [0, 0, 0],
    config: { tension: 50, friction: 14 },
    position: [0, isPortrait ? 0.03 : 0, 0],
  });

  useFrame(() => {
    if (grabTarget.current) {
      grabTarget.current.getWorldQuaternion(globalQuaternion);
      grabTarget.current.getWorldPosition(globalPos);
      blob.current.position.copy(globalPos);
      blob.current.quaternion.copy(globalQuaternion);
    }
  });

  return (
    <>
      <group ref={mergeRefs([ref, grabTarget])} position={position}>
        <Sphere args={[1, 4, 4]} scale={[0.2, 0.2, 0.2]} position={[0, -0.0, 0]} visible={false} />
      </group>

      <a.group ref={blob} {...props} {...meshSpring} frustumCulled={false}>
        <a.mesh castShadow receiveShadow={false} {...meshSpring} frustumCulled={false}>
          <sphereBufferGeometry args={[1, 256, 256]} ref={geom} />
          <AnimatedMagicalMaterial
            ref={material}
            map={selectedGradient}
            transparent={true}
            {...materialSpring}
          />
        </a.mesh>
      </a.group>
    </>
  );
}

export default forwardRef(Blob);
