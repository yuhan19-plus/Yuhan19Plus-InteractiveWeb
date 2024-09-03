/** 파일 생성자 : 임성준
 *
 * 초기 연결셋팅 : 오자현
 * 시작방법 터미널에 node server.js 입력
 *
 * */
const express = require("express");
const http = require("http");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// CORS 설정 추가
app.use(cors());
// JSON 파싱 미들웨어에 크기 제한 설정
app.use(express.json({ limit: '50mb' })); // 요청 본문 크기를 50MB로 제한
app.use(express.urlencoded({ limit: '50mb', extended: true })); // URL 인코딩된 데이터도 동일하게 설정

// MySQL 연결 설정
const mysqlconnection = mysql.createConnection({
  host: "localhost",
  user: "tester",
  password: "1234",
  database: "test1234",
});

// MySQL 연결 체크
mysqlconnection.connect((err) => {
  if (err) {
    console.error("MySQL 연결 실패:", err.message);
  } else {
    console.log("MySQL 연결 성공");
  }
});

// mysqlconnection 객체를 모듈로 내보내기
module.exports = mysqlconnection;

const testdbRoutes = require('./models/testdb'); 
// const testdbRoutes2 = require('./db/BoardTable'); // db/BoardTable의 라우트 가져오기
// app.use('/board', testdbRoutes2); // testdb2 라우트를 '/board' 경로로 사용
app.use('/', testdbRoutes); // 해당 라우트를 기본 경로로 사용

// 서버 시작
server.listen(4000, () => {
  console.log("서버가 4000번 포트에서 실행 중입니다.");
});
