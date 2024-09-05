/** 파일생성자 : 임성준
 * 게시판관리 루트 컴포넌트 - 임성준
 */

import React, { useState } from 'react'
import styled from 'styled-components'
import BoardList from '../../../../common/components/board/BoardList'
import YuhanBoardUpdatePage from '../../../../common/components/board/YuhanBoardUpdatePage';
import YuhanBoardPage from '../../../../common/components/board/YuhanBoardPage';
import YuhanBoardInsert from '../../../../common/components/board/YuhanBoardInsert';


// 첨부파일관리, 댓글관리 추가필요
// 세션에서 관리자여부를 확인하고 관리자라면 boardList에 mode에 admin을 추가하는 코드 필요

const AdminBoard = () => {
    const [currentView, setCurrentView] = useState('list');
    const [selectedBoardId, setSelectedBoardId] = useState(null); // 선택된 게시글 ID를 저장하는 상태

    const handleCreatePost = () => {
        setCurrentView('insert');
    };

    const handleSelectItem = (boardId) => {
        setSelectedBoardId(boardId); // 선택된 게시글 ID를 상태로 저장
        console.log(boardId)
        setCurrentView('page'); // 페이지 보기로 전환
    };

    const handleSelectUpdateItem = (boardId) => {
        setSelectedBoardId(boardId); // 선택된 게시글 ID를 상태로 저장
        console.log(boardId)
        setCurrentView('update'); // 업데이트 페이지 보기로 전환
    };

    
    const handleBackToList = () => {
        setCurrentView('list');
    };

    return (
        <>
            {currentView === 'insert' ? (
                <YuhanBoardInsert onCancel={handleBackToList} />
            ) : currentView === 'page' ? (
                <YuhanBoardPage boardId={selectedBoardId} onBack={handleBackToList} onCancel={handleBackToList} onSelectUpdateItem={handleSelectUpdateItem} />
            ) : currentView === 'update' ? (
                <YuhanBoardUpdatePage boardId={selectedBoardId} onBack={handleBackToList} onCancel={handleBackToList} />
            ) : (
                // <BoardList mode="side" onCreatePost={handleCreatePost} onSelectItem={handleSelectItem} onSelectUpdateItem={handleSelectUpdateItem} />
                <BoardList mode="admin" onCreatePost={handleCreatePost} onSelectItem={handleSelectItem} />
            )}
        </>
    );
}

export default AdminBoard