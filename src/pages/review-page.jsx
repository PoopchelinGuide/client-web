import React, { useEffect, useState } from 'react';
import Navigatorbar from '../components/navigatorbar';
import '../styles/review-style.css';
import { Tag } from 'antd';
import Header from '../components/header';

function ReviewPage() {
  const [reviewContent, setReviewContent] = useState([]);
  const name = '세민'; // 나중에 서버에서 화장실 정보 받을거임
  const array = [
    {
      title: '이 집 화장실 잘하네..',
      tag: ['깨끗해요', '좋아요'],
      date: '2024-04-29',
    },
    {
      title: '깨끗해요~',
      tag: ['별로'],
      date: '2024-04-27',
    },
    { title: '류세민 왔다감', date: '2024-04-30' },
    { title: '잘 쓰고 가요~', date: '2024-04-21' },
    { title: '오늘은 좀 더럽네요', date: '2024-04-23' },
    { title: '한동근동근 왔다감', date: '2024-03-18' },
    { title: '이 앱 있어서 바로', date: '2024-04-17' },
    { title: '~~~~~', date: '2024-04-20' },
    { title: '휴지가휴지가..ㅠㅜ', date: '2024-04-13' },
    { title: '이!!', date: '2024-04-02' },
    { title: '제발 맨유 결승가자!', date: '2024-04-07' },
    { title: '정말 아쉬워요 ㅠ', date: '2024-04-03' },
    { title: '아이고!', date: '2024-04-19' },
    { title: '휴지가 없어요 ㅠㅜ', date: '2024-04-05' },
    { title: '왔다감!!!!!!', date: '2024-04-15' },
  ];
  useEffect(() => {
    setReviewContent(array);
  }, []);

  const sortedReviews = reviewContent.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <div className="review-page">
      {Header(name)}
      {sortedReviews.map((item, index) => (
        <div key={index} className="list-box">
          <div className="list-box-title">
            <p className="list-box-title-text">
              {item.title}
            </p>
          </div>
          {/* 태그 정보를 표시 */}
          <div className="list-box-tag-date">
            <div className="list-box-tag">
              {item.tag &&
                item.tag.map((tag, idx) => {
                  return (
                    <Tag
                      className="list-box-tag-button"
                      color="blue"
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {tag}
                    </Tag>
                  );
                })}
            </div>
            <div className="list-box-date">
              <p className="list-box-date-text">
                {item.date}
              </p>
            </div>
          </div>
        </div>
      ))}
      {Navigatorbar()}
    </div>
  );
}

export default ReviewPage;
