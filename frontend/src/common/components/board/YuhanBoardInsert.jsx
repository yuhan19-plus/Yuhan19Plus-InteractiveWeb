/** 
 * 파일생성자 - 오자현 
 * 기능 구현- 오자현
 * 게시판 글작성페이지
 * 임시저장 기능 추가
 */
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Grid, TextField, Button, Typography, Box } from "@mui/material";
import styled from "styled-components";
import { useCookies } from "react-cookie";

const YuhanBoardInsert = ({ onCancel }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [boardData, setBoardData] = useState({
        board_title: "",
        board_content: "",
        board_writer: cookies.user, // 세션쿠키에서 user를 받아서 작성자로 입력
        files: []  // 파일 데이터를 저장하는 배열
    });
    // shouldSkipCleanup을 useRef로 관리 (useRef는 값이 변해도 컴포넌트 리렌더링을 발생시키지 않음)
    const shouldSkipCleanup = useRef(false);
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
                ...prevState,  // 기존의 boardData 상태를 유지 (board_title, board_content 등)
                files: [...prevState.files, ...uploadedFiles],  // 기존 files 배열에 새로운 파일들을 추가
            }));
        });
    }, []);

    // 드래그앤 드랍
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBoardData({ ...boardData, [name]: value });
    };

    // 게시판저장
    const handleAddData = async () => {
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
            shouldSkipCleanup.current = true;

            // boardData 초기화
            setBoardData({ board_title: "", board_content: "", board_writer: "", files: [] });

            // 상태가 반영된 후에 언마운트 (onCancel 호출)
            onCancel();  // 목록으로 돌아가거나 페이지 이동
        } catch (error) {
            console.error("Error adding data:", error);
            alert("데이터 추가 중 오류 발생!");
        }
    };

    const handleDeleteFile = (index) => {
        // 기존 파일 배열에서 해당 인덱스를 제외한 새로운 배열 생성
        const updatedFiles = boardData.files.filter((_, i) => i !== index);
        // 상태 업데이트
        setBoardData(prevState => ({
            ...prevState, // 이전 상태 유지
            files: updatedFiles // 새로운 파일 목록으로 업데이트
        }));
    };

    useEffect(() => {
        boardDataRef.current = boardData; // 상태가 변경될 때마다 참조값을 업데이트
        // console.log("boardData", boardData)
    }, [boardData]);

    // 임시저장부분
    const saveTempBoard = async () => {
        try {
            // console.log("boardData", boardDataRef.current); // boardDataRef를 사용한 상태 확인
            // files 배열을 제외한 데이터만 tempData 설정
            const tempData = {
                board_title: boardDataRef.current.board_title,
                board_content: boardDataRef.current.board_content,
                board_writer: cookies.user
            };

            const response = await fetch("/api/tempboard/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tempData),
            });

            if (response.ok) {
                console.log("임시저장성공");
            } else {
                // 응답이 성공하지 않았을 때
                const message = await response.text();
                console.log("백엔드에서 온 내용:", message);
                alert(message);
            }
        } catch (error) {
            console.error("임시 저장 중 오류 발생:", error);
        }
    };


    // 임시저장을 확인하고 사용할지 삭제할지 결정하는 함수
    const checkTempData = async () => {
        try {
            const response = await fetch("/api/tempboard/checkTempData", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: cookies.user, // 현재 사용자 ID
                }),
            });
            const data = await response.json();

            if (data.hasTempData) {
                // 임시 저장 데이터가 있으면 확인 메시지 표시
                const userChoice = window.confirm("임시 저장된 데이터가 있습니다. 사용하시겠습니까?");

                if (userChoice) {
                    // "Yes"를 선택하면 임시 저장된 데이터를 불러옴
                    fetchTempData();
                } else {
                    // "No"를 선택하면 데이터를 삭제
                    deleteTempData();
                }
            } else {
                console.log(data.message); // 임시 저장 데이터가 없는 경우 메시지 출력
            }
        } catch (error) {
            console.error("Error checking temp data:", error);
        }
    };

    // 임시 저장 데이터를 삭제하는 함수
    const deleteTempData = async () => {
        try {
            const response = await fetch("/api/tempboard/delete", {
                method: 'DELETE',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: cookies.user, // 현재 사용자 ID
                }),
            });
            if (response.ok) {
                alert("임시 저장된 데이터가 삭제되었습니다.");
            }
        } catch (error) {
            console.error("Error deleting temp data:", error);
        }
    };

    // 임시저장데이터를 읽어오는 함수
    const fetchTempData = async () => {
        try {
            const response = await fetch("/api/tempboard/read", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: cookies.user,  // 현재 사용자 ID를 전송
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // 임시 저장된 데이터가 있으면 state에 반영
                if (data.tempData) {
                    // console.log("읽어온 데이터", data.tempData);

                    // 데이터를 상태에 반영 (필요한 부분에서 반영)
                    setBoardData({
                        board_title: data.tempData.board_title,
                        board_content: data.tempData.board_content,
                        board_writer: cookies.user,
                        files: [],  // 파일 데이터는 제외
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

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            saveTempBoard();
        };
        // 브라우저 종료 시 (beforeunload 이벤트)
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload); // 이벤트 리스너 제거

            // 클린업을 스킵할 경우 처리
            if (shouldSkipCleanup.current) {
                // console.log("클린업 로직이 스킵되었습니다.");
                return;
            }
            else {
                const shouldSave = window.confirm('임시 저장하시겠습니까?');
                if (shouldSave) {
                    saveTempBoard();
                }
            }
        };
    }, []);

    // 이 컴포넌트가 실행될 때 임시저장여부확인 
    useEffect(() => {
        // 임시저장데이터여부를 알려주고 원하면 불러오도록 처리 거부하면 임시저장데이터를 삭제한다고 알려주고 삭제예정
        checkTempData();
    }, []); // 빈 배열로 첫 렌더링 시에만 실행


    return (
        <BoardLayout>
            <BoardMainLayout>
                <Box sx={{ p: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        게시물 작성
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="제목"
                                name="board_title"
                                variant="outlined"
                                required
                                value={boardData.board_title}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <div {...getRootProps()} style={{
                                border: "2px dashed #cccccc",
                                borderRadius: "8px",
                                padding: "5px",
                                textAlign: "center",
                                cursor: "pointer",
                                transition: "border-color 0.3s ease-in-out",
                                "&:hover": {
                                    borderColor: "#3f51b5",
                                },
                                backgroundColor: isDragActive ? "#f0f0f0" : "#fafafa",
                            }}>
                                <input {...getInputProps()} />

                                {boardData.files.length === 0 ? (
                                    // 파일이 없을 때만 안내 메시지 표시
                                    isDragActive ? (
                                        <p>파일을 이곳에 드롭하세요...</p>
                                    ) : (
                                        <p>파일을 여기에 드래그 앤 드롭하거나 클릭하여 파일을 선택하세요.</p>
                                    )
                                ) : (
                                    // 파일이 있을 때만 파일 목록 표시
                                    <div style={{ textAlign: "left" }}>
                                        <Box mt={2}>
                                            {/* <Typography>첨부파일</Typography> */}
                                            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                                                {boardData.files.map((file, index) => (
                                                    <li key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <span>{file.file_name} ({(file.file_size / 1024).toFixed(2)} KB) <Button
                                                            variant="outlined"
                                                            color="secondary"
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // 이벤트 전파 중단
                                                                handleDeleteFile(index); // 파일 삭제
                                                            }}
                                                        >
                                                            제거
                                                        </Button></span>

                                                    </li>
                                                ))}
                                            </ul>
                                        </Box>
                                    </div>
                                )}
                            </div>

                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="내용"
                                name="board_content"
                                variant="outlined"
                                required
                                multiline
                                rows={8}
                                value={boardData.board_content}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} textAlign="right">
                            <Button variant="contained" color="primary" onClick={() => { handleAddData(); }}>
                                게시물 등록
                            </Button>
                            <Button variant="contained" color="primary" onClick={onCancel}>
                                돌아가기
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </BoardMainLayout>
        </BoardLayout>
    );
};

export default YuhanBoardInsert;

const BoardLayout = styled.div`
    min-height: 100vh;
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

const BoardMainLayout = styled.div`
`
    ;