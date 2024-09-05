/**
 * 물리엔진 적용 : 이정민
 * position, scale 수정 및 그림자 설정 : 임성준
 */
import { useBox } from '@react-three/cannon'
import { useGLTF } from '@react-three/drei'
import React, { useEffect } from 'react'

export function SmokingBooth({position, ...props}) {
  const { scene, nodes, materials } = useGLTF('/assets/models/etc/SmokingBooth.glb')
  const [meshRef, api] = useBox(() => ({
    args: [24, 30, 32],
    type: 'Static',
    mass: 1,
    position,
    ...props
  }))

  useEffect(() => {
    scene.traverse((obj) => {
      if(obj.isObject3D) {
        obj.castShadow = true
        obj.receiveShadow = true
      }
    })
  }, [scene])

  return (
    <group
      ref={meshRef}
      onPointerUp={(e) => {
            onMove(null)
    }}>
      <group position={[1,-1,-1.5]} scale={[10.993, 9.714, 15.914]}>
        <mesh geometry={nodes.Cube002.geometry} material={materials['0CFF0F(Leaf,Smoking Booth).001']} />
        <mesh geometry={nodes.Cube002_1.geometry} material={materials['C0E8F6 (B1~9(Window)).001']} />
        <mesh geometry={nodes.Cube002_2.geometry} material={materials['FFFFFF (Number, BaskitBall).001']} />
        <mesh geometry={nodes.Cube002_3.geometry} material={materials['D2D2D2 & Metal (B4,B5,B6,B7).001']} />
        <mesh geometry={nodes.Cube002_4.geometry} material={materials['006400 (Leaf).001']} />
        <mesh geometry={nodes.Cube002_5.geometry} material={materials['2CC337 (Smoking Booth).001']} />
        <mesh geometry={nodes.Cube002_6.geometry} material={materials['000000 (B1, B2, B9, Smoking Booth).001']} />
        <mesh geometry={nodes.Cube002_7.geometry} material={materials['1760E7(Trashbaskit).001']} />
        <mesh geometry={nodes.Cube002_8.geometry} material={materials['E7E541 (Smoking Booth).001']} />
        <mesh geometry={nodes.Cube002_9.geometry} material={materials['0EA6EF (Leaf, Smoking Booth).001']} />
        <mesh geometry={nodes.Cube002_10.geometry} material={materials['E71512 (Flower, BaskiBall, Smoking Booth).001']} />
        <mesh geometry={nodes.Cube002_11.geometry} material={materials['TextTure (Smoking Booth).001']} />
      </group>
    </group>
  )
}

useGLTF.preload('/assets/models/etc/SmokingBooth.glb')