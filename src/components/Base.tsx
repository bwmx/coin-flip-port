//import * as RAPIER from "@dimforge/rapier3d-compat";
import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  CuboidCollider,
  CylinderCollider,
  RigidBody,
  useRapier,
} from "@react-three/rapier";
import { useEffect, useRef } from "react";
import useSceneStore from "./store";
import * as THREE from "three";

const hitSound = new Audio("/sound/hit1.wav");
const hit2Sound = new Audio("/sound/hit2.wav");

// origi
// function Ground() {
//   // const groundRef = useRef();
//   const colorMap = useTexture("/texture/floor/wood_floor_deck_diff_1k.jpg");
//   const disMap = useTexture("/texture/floor/wood_floor_deck_disp_1k.png");
//   const normalMap = useTexture("/texture/floor/wood_floor_deck_nor_gl_1k.jpg");
//   const roughMap = useTexture("/texture/floor/wood_floor_deck_rough_1k.jpg");
//   const aoMap = useTexture("/texture/floor/wood_floor_deck_ao_1k.jpg");

//   colorMap.repeat.set(1, 2);
//   colorMap.wrapS = THREE.RepeatWrapping;
//   colorMap.wrapT = THREE.RepeatWrapping;

//   normalMap.repeat.set(1, 2);
//   normalMap.wrapS = THREE.RepeatWrapping;
//   normalMap.wrapT = THREE.RepeatWrapping;

//   roughMap.repeat.set(1, 2);
//   roughMap.wrapS = THREE.RepeatWrapping;
//   roughMap.wrapT = THREE.RepeatWrapping;

//   aoMap.repeat.set(1, 2);
//   aoMap.wrapS = THREE.RepeatWrapping;
//   aoMap.wrapT = THREE.RepeatWrapping;

//   return (
//     <RigidBody
//       type="fixed"
//       colliders="cuboid"
//       position={[0, -1.45, 0]}
//       // ref={groundRef} // questionable if this is needed
//     >
//       <mesh rotation-x={-Math.PI / 2} position-y={0} receiveShadow castShadow>
//         <planeGeometry args={[10, 20, 50, 50]} />
//         <meshStandardMaterial
//           side={THREE.FrontSide}
//           map={colorMap}
//           normalMap={normalMap}
//           //roughnessMap={roughMap}
//           // aoMap={aoMap}
//           // the 3 below properties were previously commented out
//           // displacementMap={disMap}
//           //displacementScale={0.1}
//           //displacementBias={-0.05}
//         />
//       </mesh>
//     </RigidBody>
//   );
// }

// new
function Ground() {
  const colorMap = useTexture("/texture/floor/wood_floor_deck_diff_1k.jpg");
  const normalMap = useTexture("/texture/floor/wood_floor_deck_nor_gl_1k.jpg");
  const roughMap = useTexture("/texture/floor/wood_floor_deck_rough_1k.jpg");
  const aoMap = useTexture("/texture/floor/wood_floor_deck_ao_1k.jpg");

  colorMap.repeat.set(1, 2);
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.RepeatWrapping;

  normalMap.repeat.set(1, 2);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;

  roughMap.repeat.set(1, 2);
  roughMap.wrapS = THREE.RepeatWrapping;
  roughMap.wrapT = THREE.RepeatWrapping;

  aoMap.repeat.set(1, 2);
  aoMap.wrapS = THREE.RepeatWrapping;
  aoMap.wrapT = THREE.RepeatWrapping;

  return (
    <RigidBody type="fixed" colliders="cuboid" position={[0, -1.45, 0]}>
      <mesh rotation-x={-Math.PI / 2} position-y={0} receiveShadow castShadow>
        <planeGeometry args={[10, 20, 50, 50]} />
        <meshStandardMaterial
          side={THREE.FrontSide}
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={roughMap}
          aoMap={aoMap}
        />
      </mesh>
    </RigidBody>
  );
}

// new
function Base() {
  const {
    setFlipCoinFn,
    fallCoin,
    setFallCoin,
    setResult,
    result,
    canFlip,
    setCanFlip,
    setInit,
    init,
  } = useSceneStore((state: any) => state);


  const coinRef = useRef<any>(null);
  const [headTex, tailTex, edgeTex] = useTexture([
    "/texture/coin/heads.jpg",
    "/texture/coin/tails.jpg",
    "/texture/coin/edge.jpg",
  ]);

  // camera controls
  const { camera } = useThree();

  useFrame(() => {
    camera.lookAt(-1.6, 0, 0);
  });

  const flipCoin = () => {
    if (!coinRef.current || !canFlip) return;
    init || setInit(true);
    setFallCoin(false);
    setResult(null);
    setCanFlip(false);

    console.log(coinRef.current.translation());
    coinRef.current.setTranslation(
      { x: 0, y: coinRef.current.translation().y, z: 0 },
      true
    );

    const randomTorque = {
      x: 0.3,
      y: 0,
      z: 0,
    };
    coinRef.current.applyImpulse({ x: 0, y: 0, z: 0 }, true);
    coinRef.current.applyTorqueImpulse(randomTorque, true);
  };

  useFrame(() => {
    const rb = coinRef.current;
    if (!rb || result) return;

    const vel = rb.linvel();
    const ang = rb.angvel();
    const pos = rb.translation();

    if (!fallCoin && pos.y > 1.2) {
      rb.setGravityScale(0, true);
      // rb.setBodyType("kinematicPosition"); // no gravity
      // handle.setBodyType(rapier.RigidBodyType.KinematicPositionBased);
      
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rb.setAngvel({ x: 9, y: 0, z: 0 }, true);
    }
    
    if (fallCoin) {
      // handle.setBodyType(rapier.RigidBodyType.Dynamic);
      rb.setGravityScale(1, true); // re-enable gravity
      // rb.setBodyType("dynamic"); // gravity now active

    }

    const isSleeping =
      Math.abs(vel.x) < 0.01 &&
      Math.abs(vel.y) < 0.01 &&
      Math.abs(vel.z) < 0.01 &&
      Math.abs(ang.x) < 0.01 &&
      Math.abs(ang.y) < 0.01 &&
      Math.abs(ang.z) < 0.01;

    if (isSleeping) {
      console.log("Coin is sleeping:");
      const rotation = rb.rotation();
      const up =
        rotation.w * rotation.w -
        rotation.x * rotation.x -
        rotation.y * rotation.y +
        rotation.z * rotation.z;
      const outcome = up > 0 ? "Heads" : "Tails";
      setResult(outcome);
      setCanFlip(true);
    }
  });

  useEffect(() => setFlipCoinFn(flipCoin), [setFlipCoinFn]);

  return (
    <>
      {/* COIN */}
      <RigidBody
        ref={coinRef}
        colliders={false}
        restitution={0.5}
        friction={0.1}
        mass={3}
        name="coin"
        position-y={4}
        onCollisionEnter={() => {
          hitSound.currentTime = 0;
          hitSound.play();
        }}
        onCollisionExit={() => {
          hit2Sound.currentTime = 0;
          hit2Sound.play();
        }}
      >
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.05, 64]} />
          <meshStandardMaterial map={edgeTex} attach="material-0" />
          <meshStandardMaterial map={headTex} attach="material-1" />
          <meshStandardMaterial map={tailTex} attach="material-2" />
        </mesh>
        <CylinderCollider args={[0.025, 0.5]} position={[0, 0, 0]} />{" "}
        {/* Side */}
        <CuboidCollider
          args={[0.5, 0.005, 0.5]}
          position={[0, 0.025, 0]}
        />{" "}
        {/* Heads */}
        <CuboidCollider
          args={[0.5, 0.005, 0.5]}
          position={[0, -0.025, 0]}
        />{" "}
        {/* Tails */}
      </RigidBody>

      {/* GROUND */}
      <Ground />
    </>
  );
}
// old
// function Base() {
//   const {
//     setFlipCoinFn,
//     fallCoin,
//     setFallCoin,
//     setResult,
//     result,
//     canFlip,
//     setCanFlip,
//     setInit,
//     init,
//   } = useSceneStore((state) => state) as any;

//   const coinRef = useRef<RAPIER.RigidBody>(null);
//   const [headTex, tailTex, edgeTex] = useTexture([
//     "/texture/coin/heads.jpg",
//     "/texture/coin/tails.jpg",
//     "/texture/coin/edge.jpg",
//   ]);

//   // camera controls
//   const { camera } = useThree();

//   useFrame(() => {
//     camera.lookAt(-1.6, 0, 0);
//   });

//   const flipCoin = () => {
//     if (!coinRef.current || !canFlip) return;
//     init || setInit(true);
//     setFallCoin(false);
//     setResult(null);
//     setCanFlip(false);

//     const randomTorque = {
//       x: 0.3,
//       y: 0,
//       z: 0,
//     };
//     coinRef.current.applyImpulse({ x: 0, y: 0, z: 0 }, true);
//     coinRef.current.applyTorqueImpulse(randomTorque, true);
//   };

//   useFrame(() => {
//     const rb = coinRef.current;
//     if (!rb || result) return;

//     const vel = rb.linvel();
//     const ang = rb.angvel();
//     const pos = rb.translation();

//     if (!fallCoin && pos.y > 1.2) {
//       rb.setGravityScale(0, false);
//       rb.setLinvel({ x: 0, y: 0, z: 0 }, false);
//       rb.setAngvel({ x: 9, y: 0, z: 0 }, false);
//     }

//     if (fallCoin) {
//       rb.setGravityScale(1, false); // re-enable gravity
//     }

//     const isSleeping =
//       Math.abs(vel.x) < 0.01 &&
//       Math.abs(vel.y) < 0.01 &&
//       Math.abs(vel.z) < 0.01 &&
//       Math.abs(ang.x) < 0.01 &&
//       Math.abs(ang.y) < 0.01 &&
//       Math.abs(ang.z) < 0.01;

//     if (isSleeping) {
//       console.log("Coin is sleeping:");
//       const rotation = rb.rotation();
//       const up =
//         rotation.w * rotation.w -
//         rotation.x * rotation.x -
//         rotation.y * rotation.y +
//         rotation.z * rotation.z;
//       const outcome = up > 0 ? "Heads" : "Tails";
//       setResult(outcome);
//       setCanFlip(true);
//     }
//   });

//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   useEffect(() => setFlipCoinFn(flipCoin), [setFlipCoinFn]);

//   return (
//     <>
//       {/* COIN */}
//       <RigidBody
//         ref={coinRef}
//         colliders={false}
//         restitution={0.5}
//         friction={0.1}
//         mass={3}
//         name="coin"
//         position-y={4}
//         onCollisionEnter={() => {
//           hitSound.currentTime = 0;
//           hitSound.play();
//         }}
//         onCollisionExit={() => {
//           hit2Sound.currentTime = 0;
//           hit2Sound.play();
//         }}
//       >
//         <mesh receiveShadow castShadow>
//           <cylinderGeometry args={[0.5, 0.5, 0.05, 64]} />
//           <meshStandardMaterial map={edgeTex} attach="material-0" />
//           <meshStandardMaterial map={headTex} attach="material-1" />
//           <meshStandardMaterial map={tailTex} attach="material-2" />
//         </mesh>
//         <CylinderCollider args={[0.025, 0.5]} position={[0, 0, 0]} />{" "}
//         {/* Side */}
//         <CuboidCollider
//           args={[0.5, 0.005, 0.5]}
//           position={[0, 0.025, 0]}
//         />{" "}
//         {/* Heads */}
//         <CuboidCollider
//           args={[0.5, 0.005, 0.5]}
//           position={[0, -0.025, 0]}
//         />{" "}
//         {/* Tails */}
//       </RigidBody>

//       {/* GROUND */}
//       <Ground />
//     </>
//   );
// }

export default Base;
