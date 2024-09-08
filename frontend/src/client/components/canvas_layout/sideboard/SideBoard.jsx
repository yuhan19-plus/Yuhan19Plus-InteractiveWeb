/**
 * 파일생성자 - 오자현 
 * 기능 구현- 오자현
 * 사이드메뉴에서 보여지는 것들 조절하는 컴포넌트
 */

import React, { useState } from 'react';
import SideBoardList from './SideBoardList';
import YuhanBoardInsert from '../../../../common/components/board/YuhanBoardInsert';
import YuhanBoardPage from '../../../../common/components/board/YuhanBoardPage';
import YuhanBoardUpdatePage from '../../../../common/components/board/YuhanBoardUpdatePage';

const SideBoard = () => {
    const [currentView, setCurrentView] = useState('list');
    const [selectedBoardId, setSelectedBoardId] = useState(null); // 선택된 게시글 ID를 저장하는 상태

    const handleCreatePost = () => {
        setCurrentView('insert');
    };

    const handleSelectItem = (boardId) => {
        setSelectedBoardId(boardId); // 선택된 게시글 ID를 상태로 저장
        // console.log(boardId)
        setCurrentView('page'); // 페이지 보기로 전환
    }; 
    
    const handleSelectUpdateItem = (boardId) => {
        setSelectedBoardId(boardId); // 선택된 게시글 ID를 상태로 저장
        // console.log(boardId)
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
                <SideBoardList onCreatePost={handleCreatePost} onSelectItem={handleSelectItem} />
            )}
        </>
    );
};

export default SideBoard;