/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 KoreaCheeseRamen.glb 
*/

import { useGLTF } from '@react-three/drei'
import React from 'react'

export function KoreaCheeseRamen(props) {
  const { nodes, materials } = useGLTF('/assets/models/Food/KoreaCheeseRamen.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Cheese.geometry} material={materials.Cheese} position={[0.009, 0.178, 0.029]} rotation={[0.047, -0.002, -0.035]} scale={0.312} />
      <mesh geometry={nodes.Plate2.geometry} material={materials.Plate} position={[-0.072, -0.956, -0.111]} scale={[1.363, 0.039, 2.215]} />
      <mesh geometry={nodes.Plate.geometry} material={materials.Plate} position={[-0.028, -0.937, -0.005]} scale={[0.397, 0.047, 0.397]} />
      <mesh geometry={nodes.Gravy.geometry} material={materials.Gravy} position={[-0.028, 0.111, -0.005]} scale={1.024} />
      <group position={[0.695, -0.241, -0.104]} scale={0.029}>
        <mesh geometry={nodes.Cube.geometry} material={materials.BeanMeat} />
        <mesh geometry={nodes.Cube_1.geometry} material={materials.Carrot} />
        <mesh geometry={nodes.Cube_2.geometry} material={materials['Green Onion']} />
      </group>
      <mesh geometry={nodes.Chopstick.geometry} material={materials.Plate} position={[0.12, 0.217, -0.939]} rotation={[0.914, 0, 0]} scale={[0.039, 0.039, 1.216]} />
      <mesh geometry={nodes.Noodle.geometry} material={materials.Noodle} position={[0, -0.213, -0.022]} rotation={[-1.582, 0.002, 0.001]} scale={[0.595, 0.595, 0.311]} />
    </group>
  )
}

useGLTF.preload('/assets/models/Food/KoreaCheeseRamen.glb')
