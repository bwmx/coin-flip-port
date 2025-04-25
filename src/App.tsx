import { Canvas } from "@react-three/fiber";
import Base from "./components/Base";
import { Physics } from "@react-three/rapier";
import ButtonsContainer from "./components/ButtonsContainer";

function App() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        backgroundColor: "black",
        margin: 0,
        padding: 0,
      }}
    >
      <Canvas camera={{ position: [-5, 7.9, 0], fov: 45 }} shadows>
        <ambientLight intensity={1} />
        <directionalLight
          castShadow
          position={[10, 10, 5]}
          intensity={1}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={1}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <Physics  gravity={[0, -9.81, 0]} interpolate={false}>
          <Base outCome={"tails"} />
        </Physics>
      </Canvas>
      <ButtonsContainer />
    </div>
  );
}

export default App;
