import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { random } from 'maath';

const ParticleField = () => {
    const ref = useRef<THREE.Points>(null!);
    const sphere = useMemo(() => random.inSphere(new Float32Array(5001), { radius: 15 }) as Float32Array, []);

    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#00f3ff"
                    size={0.02}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
};

const FloatingShape = ({ position, color, speed = 1 }: { position: [number, number, number], color: string, speed?: number }) => {
    const mesh = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        mesh.current.rotation.x = t * 0.2 * speed;
        mesh.current.rotation.y = t * 0.25 * speed;
        mesh.current.position.y += Math.sin(t) * 0.002;
    });

    return (
        <Float speed={speed} rotationIntensity={1} floatIntensity={1}>
            <mesh ref={mesh} position={position}>
                <icosahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color={color} wireframe transparent opacity={0.4} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={position} scale={[0.9, 0.9, 0.9]}>
                <icosahedronGeometry args={[1, 0]} />
                <meshBasicMaterial color={color} transparent opacity={0.05} blending={THREE.AdditiveBlending} />
            </mesh>
        </Float>
    );
};

const BackgroundScene = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: true, alpha: true }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00f3ff" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#bc13fe" />

                <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
                <ParticleField />

                <FloatingShape position={[-4, 2, -2]} color="#00f3ff" speed={1.2} />
                <FloatingShape position={[4, -3, -1]} color="#bc13fe" speed={0.8} />
                <FloatingShape position={[0, 4, -4]} color="#ffffff" speed={0.5} />
                <FloatingShape position={[5, 3, -8]} color="#00f3ff" speed={0.3} />
                <FloatingShape position={[-5, -4, -6]} color="#bc13fe" speed={0.6} />
            </Canvas>
        </div>
    );
};

export default BackgroundScene;
