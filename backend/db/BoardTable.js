/** 파일 생성자 : 오자현
 *  testdb2 모듈화
 * 저장, 조회기능
 * */
const express = require("express");
const router = express.Router(); // Express 라우터 객체 생성
const mysqlconnection = require("../server"); // server.js에서 MySQL 연결 객체 가져오기

// 데이터저장
router.post("/", (req, res) => {
    const { board_title, board_content, board_writer, files } = req.body;

    // 필수 필드 체크
    if (!board_title || !board_content || !board_writer) {
        return res.status(400).send("board_title, board_content, board_writer 값이 필요합니다.");
    }

    const insertBoardQuery = `INSERT INTO board (board_title, board_content, board_writer, board_date) VALUES (?, ?, ?, NOW())`;
    const insertAttachmentQuery = `INSERT INTO attachment (board_id, file_name, file_data, upload_date, file_size, file_type) VALUES (?, ?, ?, NOW(), ?, ?)`;

    mysqlconnection.query(insertBoardQuery, [board_title, board_content, board_writer], (err, results) => {
        if (err) {
            console.error("게시물 삽입 중 에러 발생:", err);
            return res.status(500).send("게시물 삽입 중 오류가 발생했습니다.");
        }

        const boardId = results.insertId; // 삽입된 게시물의 ID를 가져옵니다.

        if (files && files.length > 0 && boardId) {
            // 각 파일에 대해 처리
            files.forEach((file) => {
                const { file_name, file_data, file_size, file_type } = file;

                // 파일 데이터를 Base64에서 Buffer로 변환합니다.
                const fileBuffer = Buffer.from(file_data, 'base64');

                mysqlconnection.query(insertAttachmentQuery, [boardId, file_name, fileBuffer, file_size, file_type], (err) => {
                    if (err) {
                        console.error("첨부파일 삽입 중 에러 발생:", err);
                        return res.status(500).send("첨부파일 삽입 중 오류가 발생했습니다.");
                    }
                });
            });
        }

        // 게시물과 파일이 모두 성공적으로 추가된 경우
        res.send("데이터 및 파일 추가 성공!");
    });
});



// 여기서는 "/"로 사용 가능. "/test2/"를 사용하면 절대 경로로 처리되고 server.js에서 설정한
// 데이터읽어오는 거
router.get("/", (req, res) => {
    const selectQuery = "SELECT * FROM board";
    const checkTableQuery = "SHOW TABLES LIKE 'board'";
    // 테이블이 존재하는지 확인 후 있으면 실행 없으면 없다고 알림
    mysqlconnection.query(checkTableQuery, (err, results) => {
        if (err) {
            console.error("테이블 확인 중 에러 발생:", err);
            return res.status(500).send("테이블 확인 중 오류가 발생했습니다.");
        }
        if (results.length === 0) {
            console.log("테이블이 없습니다.");
            return res.status(404).send("테이블이 존재하지 않습니다."); // 404에러 반환
        } else {
            mysqlconnection.query(selectQuery, (err, results) => {
                if (err) {
                    console.error("테이블 검색 중 에러 발생:", err);
                    return res.status(500).send("테이블 검색 중 오류가 발생했습니다."); // 500 상태 코드와 함께 오류 메시지 반환
                }
                // console.log("테이블이 검색되었습니다.", results);
                console.log("테이블이 검색되었습니다.");
                res.json(results); // 클라이언트에게 쿼리 결과를 JSON 형식으로 반환
            });
        }
    });
});

// 검색 요청에 대응
router.get("/search/:searchQuery", (req, res) => {
    // console.log("검색요청 진입")
    const searchData = `%${req.params.searchQuery}%`; // 부분 일치를 위해 '%'를 추가
    const searchQuery = "SELECT * FROM BOARD WHERE board_title LIKE ? OR board_writer LIKE ?";

    mysqlconnection.query(searchQuery, [searchData, searchData], (err, results) => {
        if (err) {
            console.error("테이블 검색 중 에러 발생:", err);
            return res.status(500).send("테이블 검색 중 오류가 발생했습니다.");
        } else if (results.length === 0) {
            console.log("검색 결과와 일치하는 데이터가 없습니다.");
            return res.status(404).json({ error: "해당 검색어와 일치하는 게시물이 없습니다." }); // JSON 형식으로 반환
        } else {
            // console.log("검색결과가 존재")
            // 결과를 클라이언트에 반환
            res.json({
                board: results, // 전체 결과를 반환
            });
        }
    });
});


// 게시물 하나를 보는 페이지
router.get("/:board_id", (req, res) => {
    // console.log("board_id 진입")    
    const board_id = req.params.board_id; // URL에서 board_id 추출
    // console.log("req.params 데이터",  req.params)
    const selectIdQuery = "SELECT * FROM board where board_id = ?";
    const checkTableQuery = "SHOW TABLES LIKE 'board'";
    const checkAttachmentQuery = "SELECT * FROM attachment where board_id = ?";
    const boardViewPlusQuery = "UPDATE board SET board_view = board_view + 1 WHERE board_id= ?"



    // 테이블이 존재하는지 확인 후 있으면 실행 없으면 없다고 알림
    mysqlconnection.query(checkTableQuery, (err, results) => {
        if (err) {
            console.error("테이블 확인 중 에러 발생:", err);
            return res.status(500).send("테이블 확인 중 오류가 발생했습니다.");
        }
        if (results.length === 0) {
            console.log("테이블이 없습니다.");
            return res.status(404).send("테이블이 존재하지 않습니다."); // 404에러 반환
        } else {
            // board_id에 해당하는 데이터를 검색
            mysqlconnection.query(selectIdQuery, [board_id], (err, boardResults) => {
                if (err) {
                    console.error("테이블 검색 중 에러 발생:", err);
                    return res.status(500).send("테이블 검색 중 오류가 발생했습니다."); // 500 상태 코드와 함께 오류 메시지 반환
                }
                if (boardResults.length === 0) {
                    console.log("board_id와 일치하는 항목이 없습니다.");
                    return res.status(404).send("해당 board_id와 일치하는 게시물이 없습니다."); // 404 에러 반환
                } else {
                    // 조회수 1 증가 쿼리 실행
                    mysqlconnection.query(boardViewPlusQuery, [board_id], (err, result) => {
                        if (err) {
                            console.error("조회수 증가중 오류발생", err)
                        }
                    })
                }
                // 있다면 조회수를 1올리기

                // 첨부파일 여부를 확인
                mysqlconnection.query(checkAttachmentQuery, [board_id], (err, attachmentResults) => {
                    if (err) {
                        console.error("첨부파일 검색 중 에러 발생:", err);
                        return res.status(500).send("첨부파일 검색 중 오류가 발생했습니다.");
                    }

                    // 결과를 클라이언트에 반환
                    res.json({
                        board: boardResults[0],
                        attachments: attachmentResults // 첨부파일이 없으면 빈 배열 반환
                    });
                });
            });
        }
    });
});

// 프론트에서 삭제요청이 들어오면
// 게시판 테이블의 상태속성을 비활성화로 변경하는 부분
// 추가아이디어 관리자가 게시판을 다시 복구하게 하는 기능
router.delete("/delete/:board_id", (req, res) => {
    const board_id = req.params.board_id; // URL에서 board_id 추출
    console.log("삭제요청 들어옴 board_id:", board_id)
    const deleteQuery = "UPDATE board set board_status = 'delete' where board_id = ?"

    mysqlconnection.query(deleteQuery, [board_id], (err, results) => {
        if (err) {
            console.error("삭제중 오류 발생")
            return res.status(500).send("게시판삭제중 오류발생");
        }
        console.log("테이블이 삭제되었습니다.")
        res.send("테이블 삭제 성공!")
    })

})

// 게시판 업데이트
router.put("/update/:board_id", (req, res) => {
    const board_id = req.params.board_id;
    const { board_title, board_content, files } = req.body;
    console.log("수정요청 들어옴 board_id", board_id);
    const updateBoardQuery = "UPDATE board SET board_title = ? , board_content = ? where board_id = ? ";
    const updateAttachmentQuery = `UPDATE attachment SET file_name = ? , file_data = ?, file_size = ?, file_type = ? where attachment_id = ?`;


    // mysqlconnection.query(updateBoardQuery, [board_title, board_content, board_id], (err, updateResult) => {
    //     if (err) {
    //         console.error("수정 중 오류 발생")
    //         return res.status(500).send("게시물 수정 중 오류발생");
    //     }

    //     // 첨부파일이 있는 경우
    //     if (files && files.length > 0 && board_id) {
    //         // 파일 업데이트를 위한 Promise 배열 생성

    //         // 문제상황 파일이 4개가 오간다. 수정된파일의 attachment_id를 포함해서 보내게 처리하면
    //         for (i = 0; i < files.length; i++) {
    //             const { attachment_id, file_name, file_data, file_size, file_type } = files[i];
    //             const fileBuffer = Buffer.from(file_data, 'base64');
    //             //문제는 새롭게 변경할 파일의 attachment_id는 당연히 없으니 attachment_id로 나온다.

    //             mysqlconnection.query(updateAttachmentQuery, [file_name, fileBuffer, file_size, file_type, attachment_id], (err) => {
    //                 console.log("쿼리실행됨 파일 이름", file_name, " 첨부파일id", attachment_id)
    //                 if (err) {
    //                     console.error("첨부파일 수정 중 에러 발생:", err);
    //                     return reject(err);
    //                 }
    //             })

    //         }
    //     } else {
    //         // 파일이 없는 경우에도 성공적으로 게시물만 수정되었다고 응답
    //         res.status(200).send("게시물이 성공적으로 수정되었습니다.");
    //     }

    // })

})


/*
// 여기서는 "/:index"로 사용 가능. "/testdb2/:index"로 설정해도 작동
router.put("/:index", (req, res) => {
    const index = req.params.index; // URL에서 index 추출
    const { text } = req.body; // 요청의 본문에서 업데이트할 텍스트를 가져옴
    console.log("index:", index); // index 확인
    console.log("text:", text); // 업데이트할 텍스트 확인
    if (!text) {
        return res.status(400).send("업데이트할 텍스트가 필요합니다."); // 텍스트가 없으면 400 에러 반환
    }
    const updateQuery = `UPDATE test_table2 SET text = ? WHERE ID_num = ?`;
    mysqlconnection.query(updateQuery, [text, index], (err, results) => {
        if (err) {
            console.error("테이블 수정 중 에러 발생:", err);
            return res.status(500).send("테이블 수정 중 오류가 발생했습니다.");
        }
        console.log("데이터가 성공적으로 업데이트되었습니다.");
        res.send("데이터 업데이트 성공!");
    });
});
 
// 여기서는 "/testdb2/:ID_num"로 설정되어 절대 경로로 동작함
router.delete("/:ID_num", (req, res) => {
    const ID_num = req.params.ID_num;
    const deleteQuery = `DELETE FROM test_table2 WHERE ID_num = ?`;
 
    mysqlconnection.query(deleteQuery, [ID_num], (err, results) => {
        if (err) {
            console.error("테이블 삭제 중 에러 발생:", err);
            return res.status(500).send("테이블 삭제 중 오류가 발생했습니다.");
        }
 
        if (results.affectedRows === 0) {
            console.log("삭제된 데이터가 없습니다.");
            return res.status(404).send("해당 ID_num을 가진 데이터가 없습니다.");
        }
 
        console.log("데이터가 성공적으로 삭제되었습니다.");
        res.send("데이터 삭제 성공!");
    });
});
*/
module.exports = router; // 라우터 객체 내보내기
