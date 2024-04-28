import React, { useEffect, useState } from 'react';
import Navigatorbar from '../components/navigatorbar';
import '../styles/review-style.css';
import ReviewResult from '../components/review-result';
import { PlusCircleOutlined } from '@ant-design/icons';
import {
  Avatar,
  List,
  Card,
  Tag,
  Rate,
  message,
  FloatButton,
} from 'antd';
import Header from '../components/header';
import { width } from '@fortawesome/free-solid-svg-icons/fa0';

function ReviewPage() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();

  const handleScroll = (event) => {
    setScrollPosition(event.currentTarget.scrollTop);

    if (
      event.currentTarget.scrollHeight -
        event.currentTarget.scrollTop ===
      event.currentTarget.clientHeight
    ) {
      message.info('리뷰의 끝입니다.!');
    }
  };
  const [reviewContent, setReviewContent] = useState([]);
  const name = '강남역'; // 나중에 서버에서 화장실 정보 받을거임
  const array = [
    {
      title: '이 집 화장실 잘하네..',
      tag: ['깨끗해요', '휴지'],
      date: '2024-04-29',
      nickname: '유저1',
      rate: 4.5,
    },
    {
      title: '깨끗해요~',
      tag: ['깨끗해요'],
      date: '2024-04-27',
      nickname: '유저2',
      rate: 4.0,
    },
    {
      title: '나 왔다감~~',
      date: '2024-04-30',
      nickname: '유저3',
      tag: ['좌변기'],
      rate: 3.5,
    },
    {
      title: '잘 쓰고 가요~',
      date: '2024-04-21',
      nickname: '유저4',
      tag: ['깨끗해요', '온수'],
      rate: 4.5,
    },
    {
      title: '오늘은 좀 더럽네요',
      date: '2024-04-23',
      nickname: '유저5',
      tag: ['휴지통 X', '온수'],
      rate: 4.5,
    },
    {
      title: '한동근동근 왔다감',
      date: '2024-03-18',
      nickname: '유저6',
      tag: ['깨끗해요', '휴지통 X'],
      rate: 4.5,
    },
    {
      title: '이 앱 있어서 바로',
      date: '2024-04-17',
      nickname: '유저7',
      tag: ['깨끗해요', '휴지통 X'],
      rate: 4.5,
    },
    {
      title: '~~~~~',
      date: '2024-04-20',
      nickname: '유저8',
      tag: ['깨끗해요', '휴지통 X'],
      rate: 4.5,
    },
    {
      title: '휴지가휴지가..ㅠㅜ',
      date: '2024-04-13',
      nickname: '유저9',
      tag: ['깨끗해요', '좌변기'],
      rate: 4.5,
    },
    {
      title: '이!!',
      date: '2024-04-02',
      nickname: '유저10',
      tag: ['깨끗해요', '좌변기'],
      rate: 4.5,
    },
    {
      title: '제발 맨유 결승가자!',
      date: '2024-04-07',
      nickname: '유저11',
      tag: ['깨끗해요', '휴지'],
      rate: 4.5,
    },
  ];

  var sum = 0.0;
  var length = array.length;
  array.forEach(function (item, index) {
    sum += item.rate;
  });
  sum = sum / length;
  useEffect(() => {
    setReviewContent(array);
  }, []);

  const sortedReviews = reviewContent.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <div
      className="list-box"
      id="box"
      onScroll={handleScroll}
    >
      {Header(name, sum, [])}
      <div className="list-box-margin">
        {/* ReviewResult() */}
        <List
          itemLayout="verticalrizontal"
          dataSource={array}
          renderItem={(item, index) => (
            <List.Item>
              <Card className="data-box">
                <Card.Meta
                  avatar={
                    <Avatar
                      src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                    />
                  }
                  title={
                    <span>
                      {' '}
                      <span
                        style={{
                          fontFamily: 'SUITE-Regular',
                          float: 'left',
                          fontSize: '0.8rem',
                        }}
                      >
                        {item.nickname}
                      </span>
                      {// <span style={{float:"left"}}>{item.title}</span> 
                      }
                    </span>
                  }
                  description={
                    <span style={{ color: 'black' }}>
                      <span>{item.title}</span>
                      <Rate
                        style={{ float: 'right' }}
                        disabled
                        allowHalf
                        defaultValue={item.rate}
                      />
                    </span>
                  }
                />

                <div
                  style={{
                    marginTop: '1rem',
                    marginLeft: '2.4rem',
                  }}
                >
                  {item.tag.map((item, index) => (
                    <Tag
                      style={{
                        fontFamily: 'SUITE-Regular',
                        float: 'left',
                        marginLeft: '0.2rem',
                      }}
                      bordered={false}
                      color="cyan"
                    >
                      {' '}
                      {item}
                    </Tag>
                  ))}
                  <span style={{ float: 'right' }}>
                    {item.date}{' '}
                  </span>
                </div>
              </Card>
              
            </List.Item>
          )
        }
        />
      
      </div>
      {<FloatButton style={{float: 'right', position: 'sticky', zIndex: '13'}} type='primary' icon={<PlusCircleOutlined />}/>}
      {Navigatorbar()}
    </div>
  );
}

export default ReviewPage;
