import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const SpatialCanvas3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for objects
    const group = new THREE.Group();
    scene.add(group);

    // 1. Floating 3D Geometric Objects (Spatial Holograms)
    // Icosahedron (Academic AI Core)
    const icoGeo = new THREE.IcosahedronGeometry(4, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    icoMesh.position.set(-14, 6, -5);
    group.add(icoMesh);

    // Inner glowing sphere inside Icosahedron
    const sphereGeo = new THREE.SphereGeometry(2, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: false,
      transparent: true,
      opacity: 0.25
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    icoMesh.add(sphereMesh);

    // Torus Knot (Spatial Computation Topology)
    const torusGeo = new THREE.TorusKnotGeometry(3, 0.8, 64, 16);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.position.set(16, -6, -8);
    group.add(torusMesh);

    // Octahedron (Data Crystal)
    const octaGeo = new THREE.OctahedronGeometry(3.5, 0);
    const octaMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const octaMesh = new THREE.Mesh(octaGeo, octaMat);
    octaMesh.position.set(12, 10, -10);
    group.add(octaMesh);

    // Dodecahedron (Campus Knowledge Matrix)
    const dodecaGeo = new THREE.DodecahedronGeometry(3, 0);
    const dodecaMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const dodecaMesh = new THREE.Mesh(dodecaGeo, dodecaMat);
    dodecaMesh.position.set(-16, -8, -12);
    group.add(dodecaMesh);

    // 2. Spatial Starfield / Data Nodes (Particles)
    const particleCount = 450;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0x6366f1),
      new THREE.Color(0xa855f7),
      new THREE.Color(0x06b6d4),
      new THREE.Color(0xec4899),
      new THREE.Color(0x10b981)
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMaterial = new THREE.PointsMaterial({
      size: 0.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.65
    });

    const particleSystem = new THREE.Points(geometry, pMaterial);
    scene.add(particleSystem);

    // 3. Grid Plane (Holographic Floor Horizon)
    const gridHelper = new THREE.GridHelper(90, 30, 0x6366f1, 0x1e293b);
    gridHelper.position.y = -16;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.25;
    scene.add(gridHelper);

    // Mouse Tracking for Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      targetX = mouseX * 4;
      targetY = -mouseY * 4;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Rotate 3D Spatial Meshes
      icoMesh.rotation.x = elapsedTime * 0.25;
      icoMesh.rotation.y = elapsedTime * 0.35;
      sphereMesh.rotation.y = -elapsedTime * 0.5;

      torusMesh.rotation.x = elapsedTime * 0.3;
      torusMesh.rotation.y = elapsedTime * 0.2;
      torusMesh.rotation.z = elapsedTime * 0.15;

      octaMesh.rotation.y = elapsedTime * 0.4;
      octaMesh.rotation.z = elapsedTime * 0.2;

      dodecaMesh.rotation.x = -elapsedTime * 0.2;
      dodecaMesh.rotation.y = elapsedTime * 0.3;

      // Rotate and float particle starfield
      particleSystem.rotation.y = elapsedTime * 0.03;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.05) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      icoGeo.dispose();
      torusGeo.dispose();
      octaGeo.dispose();
      dodecaGeo.dispose();
      sphereGeo.dispose();
      geometry.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity: 0.85 }}
    />
  );
};
