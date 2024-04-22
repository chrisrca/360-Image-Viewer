import React, { useRef } from 'react';
import {Canvas, extend, ThreeEvent} from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {TextureLoader, Mesh} from 'three';
import { THREE } from "aframe";
import image from "./360image.jpeg"

extend({ OrbitControls });

const Scene: React.FC = () => {
    const meshRef = useRef<Mesh>(null);

    const hotspots = [
        { uMin: 0.2834, uMax: 0.4060, vMin: 0.4149, vMax: 0.6492 },
    ];

    const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
        const uv = event.uv;
        if (!uv) {
            console.log("no data");
            return;
        }   // Check if UV data is present

        const isOverHotspot = hotspots.some(hotspot =>
            uv.x >= hotspot.uMin && uv.x <= hotspot.uMax &&
            uv.y >= hotspot.vMin && uv.y <= hotspot.vMax
        );

        if (isOverHotspot) {
            console.log('hovered over tri\n');
        }
    };


    return (
        <mesh
            ref={meshRef}
            onPointerMove={handlePointerMove}
        >
            <sphereGeometry args={[5, 64, 64]}/>
            <meshBasicMaterial map={new TextureLoader().load(image)} side={THREE.BackSide}/>
        </mesh>
    );
};

const App = () => {
    return (
        <Canvas
            camera={{fov: 75, position: [0, 0, 5]}}
            style={{height: '100vh', width: '100vw'}}
        >
            <OrbitControls enableZoom={false}/>
            <Scene/>
        </Canvas>
    );
}

export default App;
