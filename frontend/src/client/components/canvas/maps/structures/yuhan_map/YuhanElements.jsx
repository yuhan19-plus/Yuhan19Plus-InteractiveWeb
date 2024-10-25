/** 파일 생성자 : 임성준
 * 나무 흡연장 등 오브젝트 배치하는 곳
 * 임성준
 * - 바닥 셋팅 (24/08/02)
 * - 투명벽 셋팅 (24/08/03)
 * - position 수정 및 그룹화 (24/08/26)
 * - 오브젝트 통합(24/08/23)
 * 
 * 이정민
 * - 초기 오브젝트 position 설정(24/08/14)
 * 
 * 오자현
 * - 유한TV 셋팅 (24/08/27)
 * - 가로등 position, 그룹화(24/08/28)
 */
import React from 'react'

// 공원
import MainPark from './elements/park/MainPark'
import SubPark from './elements/park/SubPark'

// etc
import Welcome from './elements/etc/Welcome'
import { SideWalk } from './elements/road/SideWalk'
import { YuhanTV } from './elements/yuhanTv/YuhanTV'

// 그룹화
import SmokingGroup from './elements/SmokingGroup'
import GrassGroup from './elements/park/grass/GrassGroup'
import TreeGroup from './elements/park/tree/TreeGroup'
import TerraceGroup from './elements/TerraceGroup'
import BuildingGroup from './elements/BuildingGroup'
import EtcGroup from './elements/EtcGroup'
import StreetLampGroup from './elements/StreetLampGroup'
import GuideGroup from './elements/GuideGroup'

const YuhanElements = () => {
    return (
        <>
            {/* 유한대 Welcome */}
            <Welcome />

            {/* 가이드 뷰일 경우 */}
            <GuideGroup />

            {/* 그룹화 */}
            <BuildingGroup />
            <TreeGroup />
            <GrassGroup />
            <TerraceGroup />
            <SmokingGroup />
            <EtcGroup />
            <StreetLampGroup/>

            {/* 인도 */}
            <SideWalk position={[-0.5, -6.6, 0]} />

            {/* 공원 */}
            <MainPark />
            <SubPark />

            {/* 유한TV */}
            <YuhanTV position={[-125, 45, -557.49]} rotation={[0,0,0]}/>
        </>
    )
}

export default YuhanElements