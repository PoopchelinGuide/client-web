import React, { useEffect, useState } from 'react';
import '../styles/reviewWrite-style.css';
import Header from '../components/header';
import { Rate, Input, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaPoo,
  FaBan,
  FaHandSparkles,
  FaToiletPaper,
  FaToilet,
  FaThermometerThreeQuarters,
  FaTrash,
  FaDisease,
} from 'react-icons/fa';
import axios from 'axios';

function ReviewWritePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    id,
    name,
    sum,
    type,
    tag = [],
  } = location.state || {
    id: null,
    name: null,
    sum: '0.0',
    type: false,
    tag: [],
  };

  const [headerName, setHeaderName] = useState(''); // 헤더로 보낼
  const [mostTag, setMostTag] = useState([]); // 가장 많이 사용된 태그
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [userRate, setUserRate] = useState(0.0);
  const [clicked, setClicked] = useState({});
  const [showWarning, setShowWarning] = useState(true);

  const tagArrays = [
    '깨끗해요',
    '더러워요',
    '휴지 O',
    '휴지 X',
    '좌변기',
    '푸세식',
    '온수 O',
    '온수 X',
    '휴지통 O',
    '휴지통 X',
  ];
  // 별점이 변경될 때 호출될 함수입니다.
  const handleRateChange = (value) => {
    setUserRate(value);
  };

  const tagButtons = [
    { text: '깨끗해요', icon: <FaHandSparkles /> },
    { text: '더러워요', icon: <FaDisease /> },
    { text: '휴지', icon: <FaToiletPaper /> },
    { text: '휴지', icon: <FaBan /> },
    { text: '좌변기', icon: <FaToilet /> },
    { text: '푸세식', icon: <FaPoo /> },
    { text: '온수', icon: <FaThermometerThreeQuarters /> },
    { text: '온수', icon: <FaBan /> },
    { text: '휴지통', icon: <FaTrash /> },
    { text: '휴지통', icon: <FaBan /> },
  ];

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
        message.info('최대 3개까지만 선택할 수 있습니다.');
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

  const handleContentChange = (e) => {
    const input = e.target.value;
    if (input.length > 10) {
      if (showWarning) {
        message.warning(
          '리뷰는 10자를 초과할 수 없습니다.',
          5
        );
        setShowWarning(false);
      }
      setContent(input.slice(0, 10));
    } else {
      setContent(input);
      setShowWarning(true);
    }
  };

  const submitReview = async () => {
    if (userRate === 0.0) {
      message.warning('별점을 등록해주세요.');
      return;
    }

    const selectedTags = Object.entries(clicked)
      .filter(([index, isSelected]) => isSelected)
      .map(([index]) => tagArrays[index]);

    let toiletId = null;
    let garbagebintId = null;
    if (type == false) {
      toiletId = id;
    } else {
      garbagebintId = id;
    }

    try {
      const response = await axios.post(
        'http://172.16.0.85/review',
        {
          nickname: nickname,
          password: password,
          rate: userRate,
          content: content,
          tag: selectedTags,
          toiletId: toiletId,
          garbagebintId: garbagebintId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);
      message.success('리뷰가 등록되었습니다.');
      navigate('/review',{state:{
        id:id,
        name:name,
        type:type,
        tag:tag
      }});
    } catch (error) {
      message.error('리뷰 등록에 실패했습니다.');
    }
  };

  useEffect(() => {
    setHeaderName(name);
    setMostTag(tag);
  }, []);
  return (
    <div className="review-wirte-page">
      <Header name={name} rate={sum} tag={mostTag} />
      <div className="review-box">
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
                          ? '#FFEBEE'
                          : 'white',
                        color: clicked[index]
                          ? 'red'
                          : 'red',
                        border: clicked[index]
                          ? 'none'
                          : '0.1rem solid rgb(254, 160, 160)',
                      }
                    : {
                        backgroundColor: clicked[index]
                          ? '#E6FFFB'
                          : 'white',
                        color: clicked[index]
                          ? '#3BB26F'
                          : '#3BB26F',
                        border: clicked[index]
                          ? 'none'
                          : '0.1rem solid #90e4b5',
                      }
                }
              >
                {item.text}　{item.icon}
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
              {userRate.toFixed(1)}
            </span>
          </div>
          <textarea
            className="input-content"
            placeholder="리뷰를 작성해주세요"
            value={content}
            onChange={handleContentChange}
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
          <button
            className="input-info-btn"
            onClick={submitReview}
          >
            리뷰 등록
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewWritePage;
