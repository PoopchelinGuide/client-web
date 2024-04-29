import React, { useEffect, useState } from 'react';
import '../styles/review-style.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlusCircleOutlined } from '@ant-design/icons';
import {
  Avatar,
  List,
  Card,
  Tag,
  Rate,
  message,
  FloatButton,
  Input,
  Modal,
} from 'antd';
import Header from '../components/header';
import axios from 'axios';
import moment from 'moment';
import { FaXmark } from 'react-icons/fa6';
import Password from 'antd/es/input/Password';

function ReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const toiletId = useState(1);
  //const { toiletId } = location.state || {};
  const [scrollPosition, setScrollPosition] = useState(0);
  const [reviewList, setReviewList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [delPassword, setDelPassword] = useState(''); // 삭제 비밀번호
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
  const name = '강남역'; // 나중에 서버에서 화장실 정보 받을거임

  var sum = 0.0;
  var length = reviewList.length;
  reviewList.forEach(function (item, index) {
    sum += item.rate;
  });
  sum = sum / length;

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const reviewData = async () => {
    console.log('toilet 번호' + toiletId);
    try {
      const response = await axios.get(
        `http://192.168.0.96/review/tg/${1}?type=false`
      );
      if (response.status == 200) {
        const reviewData = response.data;
        if (Array.isArray(reviewData)) {
          const reviewDataList = reviewData.map(
            (review) => ({
              id: review.id,
              content: review.content,
              nickname: review.nickname,
              writeDate: moment
                .utc(review.writeDate)
                .format('YYYY-MM-DD'),
              rate: review.rate,
              tag: review.tag || [],
            })
          );
          setReviewList(reviewDataList);
          console.log(response.data);
          console.log('받아온 리뷰 리스트' + reviewList);
          console.log('서버로 부터 데이터를 받았습니다');
        }
      }
    } catch (error) {
      console.log('서버연결 실패!');
    }
  };
  useEffect(() => {
    reviewData();
  }, []);

  const deleteReview = async (id) => {
    try {
      const response = await axios.delete(
        `http://192.168.0.96/review/${id}`
      );
    } catch (error) {
      console.log('리뷰 삭제 실패!');
    }
  };
  const sortedReviews = reviewList.sort((a, b) => {
    return new Date(b.writeDate) - new Date(a.writeDate);
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
          dataSource={sortedReviews}
          renderItem={(item, index) => (
            <List.Item>
              <Card className="data-box">
                <div
                  style={{
                    position: 'inherit',
                    float: 'right',
                  }}
                >
                  <FaXmark
                    className="delete-button"
                    onClick={showModal}
                  />
                  <Modal
                    title="삭제 하시겠습니까?"
                    open={isModalOpen}
                    onOk={() =>
                      deleteReview(item.id, delPassword)
                    }
                    onCancel={handleCancel}
                    className="custom-modal-mask" // 사용자 정의 클래스 적용
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }} // 배경색을 반투명하게 설정
                  >
                    <Input
                      type="text"
                      placeholder="비밀번호"
                      value={delPassword}
                      onChange={(e) =>
                        setDelPassword(e.target.value)
                      }
                    ></Input>
                  </Modal>
                </div>
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
                      {
                        // <span style={{float:"left"}}>{item.title}</span>
                      }
                    </span>
                  }
                  description={
                    <span style={{ color: 'black' }}>
                      <span>{item.content}</span>

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
                      key={index}
                      style={{
                        fontFamily: 'SUITE-Regular',
                        float: 'left',
                        marginLeft: '0.2rem',
                      }}
                      bordered={false}
                      color="cyan"
                    >
                      {item}
                    </Tag>
                  ))}
                  <span style={{ float: 'right' }}>
                    {item.writeDate}{' '}
                  </span>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </div>
      {
        <FloatButton
          style={{
            float: 'right',
            position: 'fixed',
            zIndex: '13',
          }}
          type="primary"
          onClick={() => {
            console.log('리뷰작성 버튼 클릭' + sum);
            navigate('/review-write', {
              state: {
                sum: sum,
              },
            });
          }}
          icon={<PlusCircleOutlined />}
        />
      }
    </div>
  );
}

export default ReviewPage;
