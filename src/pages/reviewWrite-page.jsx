import React, { useState } from 'react';
import Navigatorbar from '../components/navigatorbar';
import '../styles/reviewWrite-style.css';
import Header from '../components/header';
import Modal_a from '../components/modal';
import { Modal } from 'antd';

function ReviewWritePage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [modalOpen, setModalOpen] = useState(false); // 모달 상태
  const name = '세민'; // 나중에 서버에서 화장실 정보 받을거임

  const tagButtons = [
    '깨끗해요',
    '친절해요',
    '맛있어요',
    '가격이 착해요',
    '분위기 좋아요',
    '다시 가고 싶어요',
    '추천해요',
    '좋아요',
    '별로에요',
    '비추에요',
  ];

  const [clicked, setClicked] = useState({});

  const handleClick = (index) => {
    const clickedCount = Object.keys(clicked).filter(
      (key) => clicked[key]
    ).length;
    const isAlreadyClicked = clicked[index];

    if (!isAlreadyClicked && clickedCount >= 3) {
      setModalOpen(true); // 모달 열기
    } else {
      setClicked((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    }
  };
  return (
    <div className="review-box">
      <Modal
        title="알림"
        visible={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        okText="확인"
        cancelText="취소"
      >
        최대 3개까지만 선택할 수 있습니다.
      </Modal>
      {Header(name)}
      <div className="input-box">
        <div className="input-info">
          <input
            className="input-info-id"
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <input
            className="input-info-pw"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="input-info-btn">
            리뷰 등록
          </button>
        </div>
        <input
          className="input-content"
          placeholder="리뷰를 작성해주세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="tagbtn-box">
        {tagButtons.map((tag, index) => (
          <button
            key={index}
            className="tagbtn"
            onClick={() => handleClick(index)}
            style={{
              backgroundColor: clicked[index]
                ? 'rgb(49, 126, 234)'
                : 'white',

              color: clicked[index]
                ? 'white'
                : 'rgb(49, 126, 234)',
            }}
          >
            {tag}
          </button>
        ))}
      </div>
      {Navigatorbar()}
    </div>
  );
}

export default ReviewWritePage;
