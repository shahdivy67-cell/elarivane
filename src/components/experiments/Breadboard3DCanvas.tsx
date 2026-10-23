import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { CircuitComponentInstance, WireSpec } from '../../types/experiments';

interface Breadboard3DCanvasProps {
  components: CircuitComponentInstance[];
  wires: WireSpec[];
  selectedCompId: string | null;
  onSelectComponent: (id: string | null) => void;
  onPinClick?: (pinKey: string) => void;
  connectingPin: string | null;
}

export const Breadboard3DCanvas: React.FC<Breadboard3DCanvasProps> = ({
  components,
  wires,
  selectedCompId,
  onSelectComponent,
  onPinClick,
  connectingPin,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectsGroupRef = useRef<THREE.Group | null>(null);
  const wiresGroupRef = useRef<THREE.Group | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;
    const width = mountRef.current.clientWidth || 600;
    const height = mountRef.current.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a110d'); // Dark botanical workbench background
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 7, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mountRef.current.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xa7f3d0, 1.2);
    dirLight.position.set(5, 12, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const softFillLight = new THREE.PointLight(0x38bdf8, 0.6, 20);
    softFillLight.position.set(-6, 4, 3);
    scene.add(softFillLight);

    // Grid Workbench Floor / Breadboard base
    const gridHelper = new THREE.GridHelper(16, 32, 0x059669, 0x132b1e);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // Solderless Breadboard visual slab (830 tie-points layout)
    const boardGeom = new THREE.BoxGeometry(10, 0.4, 4.5);
    const boardMat = new THREE.MeshStandardMaterial({
      color: 0x18241c, // Dark emerald slate breadboard
      roughness: 0.6,
      metalness: 0.1,
    });
    const breadboardMesh = new THREE.Mesh(boardGeom, boardMat);
    breadboardMesh.position.set(0, -0.2, 0);
    breadboardMesh.receiveShadow = true;
    scene.add(breadboardMesh);

    // Breadboard power rails & center divider grooves
    const railGeom = new THREE.BoxGeometry(9.6, 0.05, 0.15);
    const redRailMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const blueRailMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });

    const topRedRail = new THREE.Mesh(railGeom, redRailMat);
    topRedRail.position.set(0, 0.02, 1.9);
    scene.add(topRedRail);

    const topBlueRail = new THREE.Mesh(railGeom, blueRailMat);
    topBlueRail.position.set(0, 0.02, 1.6);
    scene.add(topBlueRail);

    const botRedRail = new THREE.Mesh(railGeom, redRailMat);
    botRedRail.position.set(0, 0.02, -1.6);
    scene.add(botRedRail);

    const botBlueRail = new THREE.Mesh(railGeom, blueRailMat);
    botBlueRail.position.set(0, 0.02, -1.9);
    scene.add(botBlueRail);

    // Groups for dynamic entities
    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);
    objectsGroupRef.current = objectsGroup;

    const wiresGroup = new THREE.Group();
    scene.add(wiresGroup);
    wiresGroupRef.current = wiresGroup;

    // Mouse drag orbit controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let theta = 0; // azimuthal angle
    let phi = Math.PI / 3; // polar angle
    let radius = 12;

    const dom = renderer.domElement;
    const onMouseDown = (e: MouseEvent) => {
      // Right-click or middle-click or drag to rotate camera
      if (e.button === 0 || e.button === 2) {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      theta -= dx * 0.008;
      phi = Math.max(0.2, Math.min(Math.PI / 2.1, phi - dy * 0.008));

      camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(0, 0, 0);
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      radius = Math.max(4, Math.min(22, radius + e.deltaY * 0.015));
      camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(0, 0, 0);
    };

    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth || 600;
      const h = mountRef.current.clientHeight || 450;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update dynamic 3D components and pins
  useEffect(() => {
    const group = objectsGroupRef.current;
    if (!group) return;

    // Clear existing
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
    }

    components.forEach(comp => {
      const compGroup = new THREE.Group();
      compGroup.position.set(comp.position[0], comp.position[1] + 0.3, comp.position[2]);
      compGroup.rotation.set(comp.rotation[0], comp.rotation[1], comp.rotation[2]);

      const isSelected = comp.id === selectedCompId;

      // Component Body Mesh
      let bodyGeom: THREE.BufferGeometry;
      let bodyMat: THREE.Material;

      if (comp.typeId === 'resistor') {
        bodyGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.8, 16);
        bodyGeom.rotateZ(Math.PI / 2);
        bodyMat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0x34d399 : 0xd4a373,
          roughness: 0.5,
        });
      } else if (comp.typeId === 'led') {
        bodyGeom = new THREE.SphereGeometry(0.24, 16, 16);
        const brightness = comp.state?.ledBrightness || 0;
        const baseColor = comp.properties.ledColor === 'blue' ? 0x38bdf8 : 0xef4444;
        bodyMat = new THREE.MeshStandardMaterial({
          color: baseColor,
          emissive: baseColor,
          emissiveIntensity: brightness * 2.5,
          roughness: 0.2,
          transparent: true,
          opacity: 0.9,
        });
      } else if (comp.typeId === 'dc-source' || comp.typeId === 'ac-source') {
        bodyGeom = new THREE.BoxGeometry(1.4, 0.8, 1.0);
        bodyMat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0x10b981 : 0x064e3b,
          roughness: 0.4,
          metalness: 0.3,
        });
      } else if (comp.typeId === 'arduino-uno') {
        bodyGeom = new THREE.BoxGeometry(2.2, 0.15, 1.4);
        bodyMat = new THREE.MeshStandardMaterial({
          color: 0x00878f,
          roughness: 0.3,
        });
      } else {
        bodyGeom = new THREE.BoxGeometry(0.7, 0.4, 0.5);
        bodyMat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0x34d399 : 0x334155,
          roughness: 0.5,
        });
      }

      const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
      bodyMesh.castShadow = true;
      compGroup.add(bodyMesh);

      // Pins on Component
      comp.pins.forEach(pin => {
        const pinGeom = new THREE.SphereGeometry(0.08, 10, 10);
        const pinKey = `${comp.id}:${pin.id}`;
        const isConnecting = pinKey === connectingPin;

        const pinMat = new THREE.MeshStandardMaterial({
          color: isConnecting ? 0xf59e0b : 0xe2e8f0,
          emissive: isConnecting ? 0xf59e0b : 0x000000,
          emissiveIntensity: isConnecting ? 0.8 : 0,
          metalness: 0.9,
          roughness: 0.2,
        });

        const pinMesh = new THREE.Mesh(pinGeom, pinMat);
        pinMesh.position.set(pin.relativePos[0], pin.relativePos[1], pin.relativePos[2]);
        compGroup.add(pinMesh);
      });

      group.add(compGroup);
    });
  }, [components, selectedCompId, connectingPin]);

  // Update 3D Wires routing
  useEffect(() => {
    const group = wiresGroupRef.current;
    if (!group) return;

    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
    }

    // Map pinKey -> absolute 3D position
    const pinPosMap = new Map<string, THREE.Vector3>();

    components.forEach(comp => {
      comp.pins.forEach(pin => {
        const pinKey = `${comp.id}:${pin.id}`;
        const absX = comp.position[0] + pin.relativePos[0];
        const absY = comp.position[1] + 0.3 + pin.relativePos[1];
        const absZ = comp.position[2] + pin.relativePos[2];
        pinPosMap.set(pinKey, new THREE.Vector3(absX, absY, absZ));
      });
    });

    wires.forEach(wire => {
      const start = pinPosMap.get(wire.fromPin);
      const end = pinPosMap.get(wire.toPin);
      if (!start || !end) return;

      // Create arched 3D quadratic bezier curve for realistic wire sag/bend
      const mid = new THREE.Vector3()
        .addVectors(start, end)
        .multiplyScalar(0.5);
      mid.y += Math.max(0.6, start.distanceTo(end) * 0.3); // Arched lift

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const tubeGeom = new THREE.TubeGeometry(curve, 20, 0.04, 8, false);

      const colorHex = parseInt(wire.color.replace('#', '0x'), 16) || 0xef4444;
      const tubeMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.4,
        metalness: 0.2,
      });

      const wireMesh = new THREE.Mesh(tubeGeom, tubeMat);
      group.add(wireMesh);
    });
  }, [wires, components]);

  return (
    <div className="relative w-full h-[450px] rounded-3xl overflow-hidden border border-emerald-900/60 shadow-2xl bg-[#090f0c]">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Controls Hint */}
      <div className="absolute top-3 left-3 bg-[#0c1410]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-950 text-[10px] text-stone-300 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Left-click drag to rotate • Scroll to zoom • Snapped Breadboard Pins</span>
      </div>

      {connectingPin && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-amber-950/90 text-amber-200 border border-amber-600/50 px-4 py-1.5 rounded-xl text-xs font-medium shadow-2xl animate-pulse">
          Click target pin to complete wire connection from {connectingPin}
        </div>
      )}
    </div>
  );
};
