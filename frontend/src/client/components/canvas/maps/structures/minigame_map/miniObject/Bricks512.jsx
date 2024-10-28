/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 Bricks512.glb 
*/

import { useGLTF } from '@react-three/drei'
import React from 'react'

export function Bricks512(props) {
  const { nodes, materials } = useGLTF('/assets/models/minigame/Bricks512.glb')
  return (
    <group {...props} dispose={null}>
      <group scale={[1, 0.25, 1]}>
        <mesh geometry={nodes.Cube_1.geometry} material={materials.Grass} />
        <mesh geometry={nodes.Cube_2.geometry} material={materials.Soil} />
      </group>
      <group position={[0.01, 1.155, -0.05]} rotation={[0, -Math.PI / 2, 0]} scale={[0.866, 0.85, 0.533]}>
        <mesh geometry={nodes.Cylinder_1.geometry} material={materials.BrickMain} />
        <mesh geometry={nodes.Cylinder_2.geometry} material={materials.BrickSub} />
      </group>
      <mesh geometry={nodes.Plane001.geometry} material={materials.BrickSub} position={[-0.267, 1.064, -0.022]} rotation={[0, 0, -Math.PI / 2]} scale={[0.149, 0.109, 0.109]} />
    </group>
  )
}

useGLTF.preload('/assets/models/minigame/Bricks512.glb')
