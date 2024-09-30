import React from 'react'
import styled from 'styled-components'
import YuhanCalendar from '../YuhanCalendar'

const CounselDateRegister = ({registeredDates}) => {
    console.log(registeredDates)
    return (
        <CounselDateRegisterWrapper>
            <YuhanCalendar />
        </CounselDateRegisterWrapper>
    )
}

const CounselDateRegisterWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 4px 2px 10px 0px rgba(0, 0, 0, 0.13);
    margin-bottom: 15px;
    background-color: white;
`

export default CounselDateRegister