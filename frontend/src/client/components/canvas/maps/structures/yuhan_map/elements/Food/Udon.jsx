/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 Udon.glb 
*/

import { useGLTF } from '@react-three/drei'
import React from 'react'

export function Udon(props) {
  const { nodes, materials } = useGLTF('/assets/models/Food/Udon.glb')
  return (
    <group {...props} dispose={null}>
      <group position={[0, -0.216, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.689}>
        <mesh geometry={nodes.BézierCurve.geometry} material={materials.Noodle} />
        <mesh geometry={nodes.BézierCurve_1.geometry} material={materials.Plate} />
        <mesh geometry={nodes.BézierCurve_2.geometry} material={materials.Gravy} />
        <mesh geometry={nodes.BézierCurve_3.geometry} material={materials.odang} />
        <mesh geometry={nodes.BézierCurve_4.geometry} material={materials.Material} />
        <mesh geometry={nodes.BézierCurve_5.geometry} material={materials.Odnag2} />
        <mesh geometry={nodes.BézierCurve_6.geometry} material={materials['Material.001']} />
      </group>
    </group>
  )
}

useGLTF.preload('/assets/models/Food/Udon.glb')
