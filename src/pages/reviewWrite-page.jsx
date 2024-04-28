import React, { useState } from 'react';
import '../styles/reviewWrite-style.css';
import Header from '../components/header';
import { Modal, Rate, Input } from 'antd';
import {
  FaBan,
  FaHandSparkles,
  FaToiletPaper,
  FaToilet,
  FaThermometerThreeQuarters,
  FaTrash,
  FaDisease,
} from 'react-icons/fa';

function ReviewWritePage() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [modalOpen, setModalOpen] = useState(false); // 모달 상태
  // useState를 사용해 사용자가 선택한 별점을 저장합니다.
  const [userRate, setUserRate] = useState(0.0);

  // 별점이 변경될 때 호출될 함수입니다.
  const handleRateChange = (value) => {
    setUserRate(value);
    // 여기에서 userRate를 다른 곳에 저장하거나 처리할 수 있습니다.
  };
  const name = '세민'; // 나중에 서버에서 화장실 정보 받을거임

  const tagButtons = [
    { text: '깨끗해요', icon: <FaHandSparkles /> },
    { text: '더러워요', icon: <FaDisease /> },
    { text: '휴지', icon: <FaToiletPaper /> },
    { text: '휴지', icon: <FaBan /> },
    { text: '좌변기', icon: <FaToilet /> },
    { text: '푸세식', icon: null }, // 이 아이콘은 좌변기와 같습니다, 적절한 것을 찾기 어렵습니다.
    { text: '온수', icon: <FaThermometerThreeQuarters /> },
    { text: '온수', icon: <FaBan /> },
    { text: '휴지통', icon: <FaTrash /> },
    { text: '휴지통', icon: <FaBan /> },
  ];

  const [clicked, setClicked] = useState({});

  const handleClick = (index) => {
    const clickedCount = Object.keys(clicked).filter(
      (key) => clicked[key]
    ).length;
    const isAlreadyClicked = clicked[index];
    const relatedIndex =
      index % 2 === 0 ? index + 1 : index - 1;

    if (!isAlreadyClicked && clickedCount >= 3) {
      if (clicked[relatedIndex]) {
        // 이미 3개가 선택되어 있고, 관련된 버튼이 이미 클릭된 상태일 경우, 해당 버튼의 클릭을 해제하고 새로운 클릭을 적용
        setClicked((prevClicked) => {
          const newClicked = { ...prevClicked };
          newClicked[index] = true;
          newClicked[relatedIndex] = false;
          return newClicked;
        });
      } else {
        // 3개 선택된 상태에서 바로 옆의 버튼이 클릭되지 않은 경우, 모달 열기
        setModalOpen(true);
      }
    } else {
      // 기본 클릭 처리
      setClicked((prevClicked) => {
        const newClicked = { ...prevClicked };

        if (isAlreadyClicked) {
          // 이미 클릭된 경우, 클릭 해제
          newClicked[index] = false;
        } else {
          // 새로 클릭하는 경우
          newClicked[index] = true;
          // 관련된 버튼 해제
          newClicked[relatedIndex] = false;
        }

        return newClicked;
      });
    }
  };
  return (
    <div className="review-wirte-page">
      {Header(name, 0.0, [])}
      <div className="review-box">
        <Modal
          title="알림"
          visible={modalOpen}
          onOk={() => setModalOpen(false)}
          onCancel={() => setModalOpen(false)}
          okText="확인"
          cancelText="취소"
          style={{ marginTop: '15rem' }}
        >
          최대 3개까지만 선택할 수 있습니다.
        </Modal>

        <div className="tagbtn-box">
          {tagButtons &&
            tagButtons.length > 0 &&
            tagButtons.map((item, index) => (
              <button
                key={index}
                className="tagbtn"
                onClick={() => handleClick(index)}
                style={
                  index % 2 === 1
                    ? {
                        backgroundColor: clicked[index]
                          ? 'red'
                          : 'white',
                        color: clicked[index]
                          ? 'white'
                          : 'red',
                        border: '0.2rem solid red',
                      }
                    : {
                        backgroundColor: clicked[index]
                          ? '#3BB26F'
                          : 'white',
                        color: clicked[index]
                          ? 'white'
                          : '#3BB26F',
                      }
                }
              >
                {item.text} {item.icon}
              </button>
            ))}
        </div>
        <div className="input-box">
          <div className="input-info-rate">
            <Rate
              allowHalf
              defaultValue={userRate}
              onChange={handleRateChange}
            />
            <span
              style={{
                marginLeft: '0.7rem',
                marginRight: '9rem',
              }}
            >
              {userRate.toFixed(2)}
            </span>
          </div>
          <textarea
            className="input-content"
            placeholder="리뷰를 작성해주세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="input-info">
            <Input
              className="input-info-id"
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <Input
              className="input-info-pw"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="button-box">
          <button className="input-info-btn">
            리뷰 등록
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewWritePage;
