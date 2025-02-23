/** 파일생성자 : 임성준
 * 임성준 : 프론트엔드 개발
 * 오자현 : sideboard 추가
 */
import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import styled from 'styled-components'
import Swal from 'sweetalert2'
import SideBoard from '../../../../../canvas_layout/sideboard/SideBoard'
import ClientFood from '../../../../../canvas_layout/todaymenu/ClientFood'
import DeptRecommand from '../../../../../canvas_layout/deptrecommand/deptrecommand'
import DetailFooter from './DetailFooter'
import DetailHeader from './DetailHeader'
import CounselContent from './counsel/CounselContent'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { currentProfessorUserInfo, currentStudentUserInfo, myCounsel, reqForConsultation } from '../../../../../../../redux/actions/actions'

let title

const SideMenuLayout = (props) => {
    const [cookies] = useCookies(['user'])
    const userId = cookies.user
    const userType = cookies.userType
    // console.log(userId)
    // console.log(userType)

    const dispatch = useDispatch()
    
    const { pageName, value } = props
    title = pageName
    // console.log(pageName)

    if (title === 'consultation') title = '상담신청'
    else if (title === 'board') title = '유한게시판'
    else if (title === 'food') title = '오늘의 메뉴'
    else if (title === 'deptRec') title = '학부추천'

    // 현재 학생정보 가져오기
    const CurrentStudentData = async () => {
        try {
            const response = await axios.get('/api/memberInfo/current-student-info', {
                params: {
                    studentId: userId
                }
            })

            const data = response.data
            // console.log("data", data)
            dispatch(currentStudentUserInfo(data.student))

            // Swal.fire({
            //     icon: 'success',
            //     title: '데이터 로드 성공.',
            //     text: '학생 데이터를 가져왔습니다.',
            // })
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: '오류 발생',
                text: `학생 데이터를 가져오는 도중 오류가 발생했습니다: ${error}`,
            })
        }
    }

    // 현재 교수정보 가져오기
    const CurrentProfessorData = async () => {
        try {
            const response = await axios.get('/api/memberInfo/current-professor-info', {
                params: {
                    professorId: userId
                }
            })

            const data = response.data
            // console.log("data", data)
            dispatch(currentProfessorUserInfo(data.professor))

            // Swal.fire({
            //     icon: 'success',
            //     title: '데이터 로드 성공.',
            //     text: '교수 데이터를 가져왔습니다.',
            // })
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: '오류 발생',
                text: `교수 데이터를 가져오는 도중 오류가 발생했습니다: ${error}`,
            })
        }
    }

    useEffect(() => {
        if (userId) {
            if(userType === 'student') {
                CurrentStudentData()
                dispatch(myCounsel())
            }

            if(userType === 'professor') {
                CurrentProfessorData()
                dispatch(reqForConsultation())
            }
        }
    }, [])

    return (
        <SideMenuLayoutWrapper>
            {value &&
                <>
                    <DetailHeader title={title} />
                    <DetailContent>
                        {title === '유한게시판' &&
                            <SideBoard />
                        }
                        {title === '오늘의 메뉴' &&
                            <ClientFood />
                        }
                        {title === '상담신청' &&
                            <CounselContent />
                        }
                        {title === '학부추천' &&
                            <DeptRecommand />
                        }
                    </DetailContent>
                    <DetailFooter />
                </>
            }
        </SideMenuLayoutWrapper>
    )
}

const SideMenuLayoutWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`

const DetailContent = styled.div`
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background-color: var(--sub-color);
    padding: 1rem;
`

export default SideMenuLayout