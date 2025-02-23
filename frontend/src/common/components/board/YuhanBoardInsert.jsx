/** 
 * 파일생성자 - 오자현 
 * 게시판 글작성페이지
 * 
 * 기능 구현 - 오자현
 * - 게시글저장, 파일드랍, 파일삭제, 임시저장
 */
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Grid, TextField, Button, Typography, Box } from "@mui/material";
import styled from "styled-components";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import { BackButton, ButtonContainer, InputContent, InputTitle, SubmitButtonContainer, TitleTypography, TotalSubmitButton } from "./YuhanBoardCommonStyles";

const YuhanBoardInsert = ({ onCancel }) => {
    const [cookies] = useCookies(['user']);

    const [boardData, setBoardData] = useState({
        board_title: "",
        board_content: "",
        board_writer: cookies.user, // 세션쿠키에서 user를 받아서 작성자로 입력
        writer_type: cookies.userType,
        files: []  // 파일 데이터를 저장하는 배열
    });

    const skipTempSaveOnUnmount = useRef(false);// 언마운트시 임시저장을 스킵할지 여부
    const boardDataRef = useRef(boardData); // useRef로 boardData 참조값 유지

    // 파일드랍
    const onDrop = useCallback((acceptedFiles) => {
        // 1. acceptedFiles는 사용자가 드롭한 파일 목록
        const files = acceptedFiles.map((file) => {
            // 2. 각 파일에 대해 FileReader 객체를 사용하여 파일을 읽음
            const reader = new FileReader();
            reader.readAsDataURL(file);

            return new Promise((resolve) => {
                // 3. FileReader가 파일을 다 읽으면 'loadend' 이벤트가 발생
                reader.onloadend = () => {
                    resolve({
                        file_name: file.name,
                        file_data: reader.result.split(",")[1],
                        file_size: file.size,
                        file_type: file.type,
                    });
                };
            });
        });

        // 5. 모든 파일이 처리되면 Promise.all을 사용해 모든 파일이 처리된 후에 실행
        Promise.all(files).then((uploadedFiles) => {
            // 6. setBoardData로 상태를 업데이트
            // 기존의 boardData 상태를 유지하면서, files 배열에 새로 업로드된 파일 정보를 추가
            setBoardData((prevState) => ({
                ...prevState,
                files: [...prevState.files, ...uploadedFiles],  // 기존 files 배열에 새로운 파일들을 추가
            }));
        });
    }, []);

    // 드래그앤 드랍 onDrop 때문에 onDrop함수 다음에 배치
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    // 입력값변경핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBoardData({ ...boardData, [name]: value });
    };

    // 게시판저장핸들러
    const handleAddData = async () => {
        // 제목과 내용이 비어있는지 확인
        if (!boardData.board_title.trim() || !boardData.board_content.trim()) {
            Swal.fire({
                icon: 'warning',
                title: '입력 오류',
                text: '제목과 내용을 모두 입력해주세요!',
                confirmButtonColor: '#3085d6',
            });
            return; // 입력값이 비어있을 경우 저장 절차 중단
        }
        try {
            const response = await fetch("/api/board", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(boardData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.text();
            // console.log(result);

            // 저장 완료 후 cleanup 스킵을 설정
            skipTempSaveOnUnmount.current = true;

            // boardData 초기화
            setBoardData({ board_title: "", board_content: "", board_writer: "", files: [] });

            // 상태가 반영된 후에 언마운트 (onCancel 호출)
            Swal.fire({
                icon: 'success',
                title: '성공',
                text: '게시물이 성공적으로 저장되었습니다!',
                confirmButtonColor: '#3085d6',
            }).then(() => {
                // 상태가 반영된 후에 언마운트 (onCancel 호출)
                onCancel();  // 목록으로 돌아가거나 페이지 이동
            });
        } catch (error) {
            console.error("Error adding data:", error);
            Swal.fire({
                icon: "warning",
                text: "데이터 추가 중 오류 발생!"
            })
        }
    };

    // 파일삭제핸들러
    const handleDeleteFile = (index) => {
        // 기존 파일 배열에서 해당 인덱스를 제외한 새로운 배열 생성
        const updatedFiles = boardData.files.filter((_, i) => i !== index);
        // 상태 업데이트
        setBoardData(prevState => ({
            ...prevState, // 이전 상태 유지
            files: updatedFiles // 새로운 파일 목록으로 업데이트
        }));
    };

    // 임시저장
    const saveTempBoard = async () => {
        // 유효성 검사
        if (!boardDataRef.current.board_content && !boardDataRef.current.board_title) {
            Swal.fire({
                icon: "error",
                text: "저장할 데이터가 없습니다."
            })
            return;
        }
        try {
            // console.log("boardData", boardDataRef.current); // boardDataRef를 사용한 상태 확인
            // 파일을 제외한 데이터만 tempData로 설정
            const tempData = {
                board_title: boardDataRef.current.board_title,
                board_content: boardDataRef.current.board_content,
                board_writer: cookies.user
            };

            const response = await fetch("/api/boardTemp/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tempData),
            });

            if (response.ok) {
                // console.log("임시저장성공");
            } else {
                const message = await response.text();
                // console.log("백엔드에서 온 내용:", message);
                Swal.fire({
                    icon: "error",
                    text: message
                })
            }
        } catch (error) {
            console.error("임시 저장 중 오류 발생:", error);
        }
    };

    // 임시 저장 데이터를 삭제함수
    const deleteTempData = async () => {
        try {
            const response = await fetch("/api/boardTemp/delete", {
                method: 'DELETE',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: cookies.user,
                }),
            });
            if (response.ok) {
                Swal.fire({
                    icon: "warning",
                    title: "임시데이터",
                    text: "임시 저장된 데이터가 삭제되었습니다."
                })
            }
        } catch (error) {
            console.error("Error deleting temp data:", error);
        }
    };

    // 임시저장데이터를 읽어오는 함수
    const fetchTempData = async () => {
        try {
            const response = await fetch("/api/boardTemp/read", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: cookies.user,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // 임시 저장된 데이터가 있으면 state에 반영
                if (data.tempData) {
                    // console.log("읽어온 데이터", data.tempData);

                    setBoardData({
                        board_title: data.tempData.board_title,
                        board_content: data.tempData.board_content,
                        board_writer: cookies.user,
                        files: [],  // 파일 데이터는 없으니 빈값
                    });
                } else {
                    console.log(data.message);  // 임시 저장 데이터가 없는 경우 메시지 출력
                }
            } else {
                console.error("Failed to fetch temporary data.");
            }
        } catch (error) {
            console.error("Error fetching draft data:", error);
        }
    };

    // 임시저장을 확인하고 사용할지 삭제할지 결정하는 함수
    const checkTempData = async () => {
        try {
            const response = await fetch("/api/boardTemp/checkTempData", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: cookies.user, // 현재 사용자 ID
                }),
            });
            const data = await response.json();

            if (data.hasTempData) {
                // 임시 저장 데이터가 있으면 확인 메시지 표시
                Swal.fire({
                    title: '임시 저장된 데이터가 있습니다.',
                    text: '사용하시겠습니까?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: '사용',
                    cancelButtonText: '삭제'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // "사용"을 선택하면 임시 저장된 데이터를 불러옴
                        fetchTempData();
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        // "삭제"를 선택하면 데이터를 삭제
                        deleteTempData();
                    }
                });
            } else {
                // console.log(data.message); // 임시 저장 데이터가 없는 경우 메시지 출력
            }
        } catch (error) {
            console.error("Error checking temp data:", error);
        }
    };

    const handleBeforeUnload = (event) => {
        saveTempBoard();
    };

    useEffect(() => {

        // 페이지를 떠나기 전, 임시 저장 여부를 확인하기 위해 beforeunload 이벤트 리스너 추가
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            // 컴포넌트 언마운트 시 beforeunload 이벤트 리스너 제거
            window.removeEventListener('beforeunload', handleBeforeUnload); // 이벤트 리스너 제거

            // skipTempSaveOnUnmount가 true면 임시 저장을 건너뜀
            if (skipTempSaveOnUnmount.current) {
                // console.log("클린업 로직이 스킵되었습니다.");
                return;
            }
            else {
                if (!boardDataRef.current.board_content && !boardDataRef.current.board_title) {
                    Swal.fire({
                        icon: "warning",
                        text: "저장할 데이터가 없어 임시 저장을 하지 않습니다."
                    });                    
                    return;
                }
                // 임시 저장 의사묻기
                Swal.fire({
                    title: '임시 저장하시겠습니까?',
                    text: "임시 저장을 진행하시려면 확인을 눌러주세요.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: '저장',
                    cancelButtonText: '취소'
                }).then((result) => {
                    if (result.isConfirmed) {
                        saveTempBoard();
                    }
                });
            }
        };
    }, []);

    // 임시저장여부확인 
    useEffect(() => {
        checkTempData();
    }, []);

    useEffect(() => {
        boardDataRef.current = boardData; // 상태가 변경될 때마다 참조값을 업데이트
        // console.log("boardData", boardData)
    }, [boardData]);

    return (
        <BoardLayout>
            {/* 버튼구역 */}
            <ButtonContainer>
                <BackButton onClick={onCancel} >
                    돌아가기
                </BackButton>
            </ButtonContainer>
            <TitleTypography variant="h3">
                게시물 작성
            </TitleTypography>
            <ContentContainer>
                <InputTitle
                    name="board_title"
                    value={boardData.board_title}
                    onChange={handleInputChange}
                />

                <BoardInsertDropZone {...getRootProps()}>
                    <input {...getInputProps()} />
                    {boardData.files.length === 0 ? (
                        <p>파일은 15mb를 넘으면 안됩니다.<br /> 파일을 여기에 드래그 앤 드롭하거나 클릭하여 파일을 선택하세요.</p>
                    ) : (
                        <FileList>
                            {boardData.files.map((file, index) => (
                                <FileItem key={index}>
                                    <span>
                                        {file.file_name} ({(file.file_size / 1024).toFixed(2)} KB)
                                        <FileButton
                                            onClick={(e) => {
                                                e.stopPropagation(); // 이벤트 전파 중단
                                                handleDeleteFile(index); // 파일 삭제
                                            }}
                                        >
                                            제거
                                        </FileButton>
                                    </span>
                                </FileItem>
                            ))}
                        </FileList>
                    )}
                </BoardInsertDropZone>
                <InputContent
                    name="board_content"
                    value={boardData.board_content}
                    onChange={handleInputChange}
                />
                <SubmitButtonContainer>
                    <TotalSubmitButton onClick={() => { handleAddData(); }}>
                        게시물 등록
                    </TotalSubmitButton>
                </SubmitButtonContainer>
            </ContentContainer>
        </BoardLayout>
    );
};

export default YuhanBoardInsert;

const BoardLayout = styled.div`
    height: auto;
    display: flex;
    flex-direction: column;
    
    .header {
        color: white;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
    }`
    ;

const BoardInsertDropZone = styled.div`
  border: 2px dashed #cccccc;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s ease-in-out;
  background-color: #fafafa;

  &:hover {
    border-color: #3f51b5;
  }
`;

const FileList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  text-align: left;
  margin-top: 2;
`;

const FileItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  display: flex;
  gap: 16px;
`;

const FileButton = styled(Button).attrs({
    variant: "outlined",
  })`
    margin-right: 1vw;
    color: #e74c3c !important;
    border: 1px solid #e74c3c !important;
    padding: 0 !important;
    font-size: 0.75rem;
  
    &:hover {
        background-color: #e74c3c !important;
        color: var(--sub-color) !important;
    }
  `;