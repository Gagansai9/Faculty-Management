import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground: React.FC = () => {
    // Use any to bypass strict checks for now
    const mountRef = useRef<any>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const width = mount.clientWidth;
        const height = mount.clientHeight;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(width, height);
        // @ts-ignore
        renderer.setPixelRatio(window.devicePixelRatio);
        mount.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.5,
            metalness: 0.5,
            roughness: 0.1
        });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        const light = new THREE.PointLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        scene.add(light);

        const ambient = new THREE.AmbientLight(0x404040);
        scene.add(ambient);

        camera.position.z = 5;

        // Animation loop
        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            cube.rotation.x += 0.005;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();

        // Resize handler
        const handleResize = () => {
            if (mountRef.current) {
                const w = mountRef.current.clientWidth;
                const h = mountRef.current.clientHeight;
                renderer.setSize(w, h);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
            }
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            if (mount && renderer.domElement) {
                mount.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} className="absolute inset-0 pointer-events-none" />;
};

export default ThreeBackground;
