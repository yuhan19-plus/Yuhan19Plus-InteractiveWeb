import { faBus, faLocationDot, faPlane, faSmoking } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { aerialView, campusGuideView, directionsView, initKiosk, smokingAreaView } from '../../../redux/actions/actions'

const BtnMenuGroup = () => {
    const dispatch = useDispatch()

    // 미니맵 상단 버튼 handle메서드
    const handleAerialView = (e) => {
        e.stopPropagation()
        dispatch(initKiosk())
        dispatch(aerialView())
    } 
    const handleDirectionsView = (e) => {
        e.stopPropagation()
        dispatch(directionsView())
    } 
    const handleSmokingAreaView = (e) => {
        e.stopPropagation()
        dispatch(smokingAreaView())
    }
    const handleGuideView = (e) => {
        e.stopPropagation()
        dispatch(campusGuideView())
    }

    return (
        <BtnMenuWrapper>
            <BtnList>
                <BtnItem onClick={handleAerialView} data-tooltip='항공뷰'>
                    <FontAwesomeIcon icon={faPlane} />
                </BtnItem>
                <BtnItem onClick={handleSmokingAreaView} data-tooltip='흡연구역'>
                    <FontAwesomeIcon icon={faSmoking} />
                </BtnItem>
                <BtnItem onClick={handleDirectionsView} data-tooltip='찾아오는 길'>
                    <FontAwesomeIcon icon={faBus} />
                </BtnItem>
                <BtnItem onClick={handleGuideView} data-tooltip='캠퍼스안내'>
                    <FontAwesomeIcon icon={faLocationDot} />
                </BtnItem>
            </BtnList>
        </BtnMenuWrapper>
    )
}

const BtnMenuWrapper = styled.div`
    width: 100%;
    height: 30px;
`

const BtnList = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
`

const BtnItem = styled.button`
    width: 50px;
    height: 50px;
    background-color: var(--main-color);
    border-radius: 25px;
    border: none;
    color: var(--sub-color);
    padding: 10px;
    svg {
        width: 100%;
        height: 100%;
    }

    &:hover {
        cursor: pointer;
        scale: 1.1;
        transition: .2s ease-in-out;
        position: relative;
    }

    &:hover::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--main-color);
        color: var(--sub-color);
        padding: 5px 10px;
        border-radius: 5px;
        white-space: nowrap;
        font-size: 12px;
        font-weight: 900;
        opacity: 1;
        visibility: visible;
    }

    &::after {
        content: "";
        position: absolute;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--main-color);
        color: var(--sub-color);
        padding: 5px 10px;
        border-radius: 5px;
        white-space: nowrap;
        font-size: 12px;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
    }
`

export default BtnMenuGroup