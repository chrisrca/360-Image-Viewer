import React, {useRef, useMemo, useState, useEffect} from 'react';
import { Canvas, extend, ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { TextureLoader, Mesh, Vector3, Camera } from 'three';
import imageSrc from "./360image.png";
import { THREE } from "aframe";
import "./App.css";

extend({ OrbitControls });

function Scene() {
    const { camera, gl } = useThree();
    const [hover, setHover] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const meshRef = useRef<Mesh>(null);
    const [rotationSpeed, setRotationSpeed] = useState(0.0005);
    const annotationRef = useRef<HTMLDivElement>(null);
    const texture = useMemo(() => new TextureLoader().load(imageSrc), []);

    useFrame(() => {
        updateScreenPosition(camera, gl.domElement);
        if (meshRef.current) {
            meshRef.current.rotation.y += rotationSpeed;
        }
        if (hover) {
            setRotationSpeed(speed => Math.max(0, speed - 0.00005));
        } else {
            setRotationSpeed(0.001);
        }
    });

    useEffect(() => {
        const handler = setTimeout(() => {}, 100);
        return () => clearTimeout(handler);
    }, [hover]);

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

    const R = 7; // Radius of the sphere

    const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
        const uv = event.uv;
        if (!uv) {
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

    function uvToVector3(u: number, v: number) {
        const theta = u * 2 * Math.PI;
        const phi = (0.9 - v) * Math.PI;
        const x = R * Math.sin(phi) * Math.cos(theta) * -1;
        const y = R * Math.cos(phi) * -1;
        const z = R * Math.sin(phi) * Math.sin(theta);
        return { x, y, z };
    }

    const vectors = hotspots.map(hotspot => {
        const u = (hotspot.uMin + hotspot.uMax) / 2;
        const v = hotspot.vMin; // Top v
        const vector = uvToVector3(u, v);
        return { name: hotspot.name, vector };
    });

    function updateScreenPosition(camera: Camera, canvas: HTMLCanvasElement) {
        if (!meshRef.current || !camera || !canvas) return;

        for (let i = 0; i < vectors.length; i++) {
            if (vectors[i].name === name) {
                let vector = new Vector3(vectors[i].vector.x, vectors[i].vector.y, vectors[i].vector.z); // Adjust this to match the position you want to track
                vector.applyQuaternion(meshRef.current!.quaternion);
                vector.project(camera);

                const widthHalf = 0.5 * canvas.clientWidth;
                const heightHalf = 0.5 * canvas.clientHeight;
                vector.x = (vector.x * widthHalf);
                vector.y = -(vector.y * heightHalf);

                if (annotationRef.current) {
                    annotationRef.current.style.top = `${vector.y - 80}px`;
                    annotationRef.current.style.left = `${vector.x - 150 + 15}px`;
                }
                break;
            }
        }
    }

    return (
        <>
            <Html>
                {hover && <div ref={annotationRef} className="annotation">
                    <p><strong>{name}</strong></p>
                    <p>This is some filler text you can put information about people here!</p>
                </div>}
            </Html>
            <mesh ref={meshRef} position={[0, 0, 0]} onPointerMove={handlePointerMove}>
                <sphereGeometry args={[7, 64, 64]}/>
                <meshBasicMaterial map={texture} side={THREE.BackSide}/>
            </mesh>
        </>
    );
}

const App = () => {
    return (
        <Canvas camera={{ fov: 75, position: [0, 0, 5] }} style={{ height: '100vh', width: '100vw' }}>
            <OrbitControls enableZoom={false} minPolarAngle={1.4} maxPolarAngle={1.4}/>
            <Scene/>
        </Canvas>
    );
}

export default App;