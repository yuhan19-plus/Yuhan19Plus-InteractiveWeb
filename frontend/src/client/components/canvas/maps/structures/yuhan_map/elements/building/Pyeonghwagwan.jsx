/** 파일생성자 : 이정민
 * 초기 position, scale 설정 : 이정민
 * position, scale 수정 및 그림자 설정 : 임성준
 */
import React, { useEffect, useRef, useState } from 'react'
import { useBox } from '@react-three/cannon'
import { useGLTF } from '@react-three/drei'
import { motion } from 'framer-motion-3d'
import { SmokingArea } from '../etc/SmokingArea'

export function Pyeonghwagwan({position, btnMenuValue, btnMenuName, ...props}) {
  const pyeonghwaRef = useRef()
  const [hovered, setHovered] = useState(false)

  const { scene, nodes, materials } = useGLTF('/assets/models/building/B1.glb')
  const [meshRef, api] = useBox(() => ({
    args: [270, 166, 67],
    type: 'Static',
    mass: 1,
    position,
    ...props
  }))

  const handlePointerOver = () => {
      if(btnMenuValue && btnMenuName === 'campusGuideView') {
          setHovered(true)
      }
  }
  const handlePointerOut = () => {
      setHovered(false)
  }

  useEffect(() => {
    scene.traverse((obj) => {
      if(obj.isObject3D) {
        obj.castShadow = true
        obj.receiveShadow = true
      }
    })
  }, [scene])

  return (
    <motion.group
      ref={pyeonghwaRef}
      onPointerOver={(e) => {
        e.stopPropagation()
        handlePointerOver()
      }}
      onPointerOut={handlePointerOut}
      animate={{
        y: hovered ? 25 : -1
      }}
      transition={{
        duration: 1,
        ease: 'easeInOut'
      }}
    >
      <group
        ref={meshRef}
        onPointerUp={(e) => {
              e.stopPropagation()
      }}>
        <group position={[0,-1,0]} rotation={[Math.PI/2, 0, -Math.PI]} scale={[8.072, 8.072, 9.321]}>
          <mesh geometry={nodes.텍스트003.geometry} material={materials['DCE759 & Metal (DEVName, Statue).002']} />
          <mesh geometry={nodes.텍스트003_1.geometry} material={materials['000000 (B1, B2, B9, Smoking Booth).002']} />
          <mesh geometry={nodes.텍스트003_2.geometry} material={materials['E2EBCA (B1,B4,B5,B6(BodyFrame))']} />
          <mesh geometry={nodes.텍스트003_3.geometry} material={materials['C0E8F6 (B1~9(Window))']} />
          <mesh geometry={nodes.텍스트003_4.geometry} material={materials['FFFFFF (Number, BaskitBall)']} />
          <mesh geometry={nodes.텍스트003_5.geometry} material={materials['61544D (B1,B2,B5,B6(Body)']} />
          <mesh geometry={nodes.텍스트003_6.geometry} material={materials['23683C (RoofTop)']} />
        </group>
        <group position={[0,-2.15,0]} rotation={[Math.PI/2, 0, -Math.PI]} scale={[8.072, 8.072, 9.321]}>
          <mesh geometry={nodes.텍스트003_7.geometry} material={materials['A2A2A2(B9, Park(Rock),B5-6 Plane).001']} />
          <mesh geometry={nodes.텍스트003_8.geometry} material={materials['0EA6EF (Leaf, Smoking Booth).001']} />
        </group>
      </group>
      <SmokingArea position={[150, 151.3, -70]} rotation={[Math.PI, 0, 0]} scale={[1.5, 13, 1.5]} />
    </motion.group>
  )
}

useGLTF.preload('/assets/models/building/B1.glb')
