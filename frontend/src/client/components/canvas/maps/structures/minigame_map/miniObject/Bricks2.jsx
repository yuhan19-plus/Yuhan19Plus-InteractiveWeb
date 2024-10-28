/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 Bricks2.glb 
*/

import { useGLTF } from '@react-three/drei'
import React from 'react'

export function Bricks2(props) {
  const { nodes, materials } = useGLTF('/assets/models/minigame/Bricks2.glb')
  return (
    <group {...props} dispose={null}>
      <group scale={[1, 0.25, 1]}>
        <mesh geometry={nodes.Cube_1.geometry} material={materials.Grass} />
        <mesh geometry={nodes.Cube_2.geometry} material={materials.Soil} />
      </group>
      <mesh geometry={nodes.Cube003.geometry} material={materials.BrickMain} position={[0.051, 0.343, -0.027]} rotation={[0, 1.092, 0]} scale={[0.154, 0.103, 0.309]} />
    </group>
  )
}

useGLTF.preload('/assets/models/minigame/Bricks2.glb')
