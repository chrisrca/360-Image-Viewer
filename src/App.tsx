import React, {useRef, useState, useEffect, useMemo} from 'react';
import {Canvas, extend, ThreeEvent, useFrame} from '@react-three/fiber';
import {OrbitControls, Html} from '@react-three/drei';
import { TextureLoader, Mesh } from 'three';
import { THREE } from "aframe";
import imageSrc from "./360image.png";

extend({ OrbitControls });

function Scene(): JSX.Element {
    const meshRef = useRef<Mesh>(null);
    const [hover, setHover] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const texture = useMemo(() => new TextureLoader().load(imageSrc), []);

    useFrame(() => {
        if (meshRef.current) {
            // This will rotate the sphere continuously
            meshRef.current.rotation.y += 0.0005;
        }
    });

    // Debounce state update
    useEffect(() => {
        const handler = setTimeout(() => {
            // Update hover state here if needed based on some condition
        }, 100); // Adjust debounce time as needed
        return () => clearTimeout(handler);
    }, [hover]); // Dependencies can be adjusted based on actual use case

    const hotspots = [
        { uMin: 0.0204, uMax: 0.0735, vMin: 0.3242, vMax: 0.6049, name: "Christian Reynolds" },
        { uMin: 0.1261, uMax: 0.1709, vMin: 0.3092, vMax: 0.5817, name: "Aksel Jensen" },
        { uMin: 0.2242, uMax: 0.2691, vMin: 0.3252, vMax: 0.5630, name: "Marc Wehbe" },
        { uMin: 0.3031, uMax: 0.3429, vMin: 0.3496, vMax: 0.5526, name: "Devin Mihaichuk" },
        { uMin: 0.3821, uMax: 0.4164, vMin: 0.3367, vMax: 0.5491, name: "Yan Acevedo" },
        { uMin: 0.4667, uMax: 0.5073, vMin: 0.3277, vMax: 0.5577, name: "Kai Davidson" },
        { uMin: 0.5401, uMax: 0.5783, vMin: 0.3356, vMax: 0.5450, name: "Brendan Reilly" },
        { uMin: 0.6157, uMax: 0.6577, vMin: 0.3287, vMax: 0.5470, name: "Tao Zou" },
        { uMin: 0.6839, uMax: 0.7181, vMin: 0.3421, vMax: 0.5483, name: "Tri Vien Le" },
        { uMin: 0.7777, uMax: 0.8172, vMin: 0.3352, vMax: 0.5556, name: "Brandon Yeu" },
        { uMin: 0.8618, uMax: 0.9026, vMin: 0.3262, vMax: 0.5645, name: "Lorenzo Manfredi Segato" },
        { uMin: 0.9307, uMax: 0.9708, vMin: 0.3215, vMax: 0.5567, name: "Colin Williams" },
    ];

    const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
        const uv = event.uv;
        if (!uv) {
            console.log("no UV data");
            return;
        }

        const isOverHotspot = hotspots.some(hotspot => {
            if (uv.x >= hotspot.uMin && uv.x <= hotspot.uMax &&
                uv.y >= hotspot.vMin && uv.y <= hotspot.vMax) {
                setName(hotspot.name);
                return true;
            }
            return false;
        });

        setHover(isOverHotspot);
    };

    return (
        <>
            <Html>
                {hover && <div style={{
                    color: "white",
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    padding: '10px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '10px',
                }}>{name}</div>}
            </Html>
            <mesh
                ref={meshRef}
                onPointerMove={handlePointerMove}
            >
                <sphereGeometry args={[10, 64, 64]}/>
                <meshBasicMaterial map={texture} side={THREE.BackSide}/>
            </mesh>
        </>
    );
};

const App = () => {
    return (
        <Canvas
            camera={{fov: 75, position: [0, 0, 5]}}
            style={{height: '100vh', width: '100vw'}}
        >
            <OrbitControls enableZoom={false} minPolarAngle={1.4} maxPolarAngle={1.4}/>
            <Scene/>
        </Canvas>
    );
}

export default App;
