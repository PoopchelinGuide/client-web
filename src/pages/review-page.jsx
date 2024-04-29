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
  const [toiletId] = useState(1); // useState를 사용하는 부분 수정
  const [scrollPosition, setScrollPosition] = useState(0);
  const [reviewList, setReviewList] = useState([]);
  const [modalOpenId, setModalOpenId] = useState(null); // 수정된 상태
  const [delPassword, setDelPassword] = useState('');

  const handleScroll = (event) => {
    setScrollPosition(event.currentTarget.scrollTop);
    if (
      event.currentTarget.scrollHeight -
        event.currentTarget.scrollTop ===
      event.currentTarget.clientHeight
    ) {
      message.info('리뷰의 끝입니다!');
    }
  };

  const name = '강남역';

  let sum = 0.0;
  reviewList.forEach((item) => {
    sum += item.rate;
  });
  sum = reviewList.length > 0 ? sum / reviewList.length : 0;

  const showModal = (id) => {
    setModalOpenId(id);
  };

  const handleCancel = () => {
    setModalOpenId(null);
  };

  const deleteReview = async (id) => {
    try {
      const response = await axios.delete(
        `http://192.168.0.96/review/${id}?password=${delPassword}`
      );
      if (response.status === 200) {
        message.success('리뷰가 삭제되었습니다.');
        setModalOpenId(null); // 모달 닫기
        reviewData();
      }
    } catch (error) {
      message.error('리뷰 삭제 실패!');
    }
  };

  const reviewData = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.96/review/tg/${toiletId}?type=false`
      );
      if (response.status === 200) {
        const reviewDataList = response.data.map(
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
      }
    } catch (error) {
      message.error('서버 연결 실패!');
    }
  };

  useEffect(() => {
    reviewData();
  }, []);

  return (
    <div
      className="list-box"
      id="box"
      onScroll={handleScroll}
    >
      {Header(name, sum, [])}
      <div className="list-box-margin">
        <List
          itemLayout="vertical"
          dataSource={reviewList}
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
                    onClick={() => showModal(item.id)}
                  />
                  {modalOpenId === item.id && (
                    <Modal
                      title="삭제 하시겠습니까?"
                      open={modalOpenId === item.id}
                      onOk={() => deleteReview(item.id)}
                      onCancel={handleCancel}
                      style={{
                        marginTop: '14rem',
                        backgroundColor:
                          'rgba(0, 0, 0, 0.5)',
                        padding: 0,
                        borderRadius: '0.5rem',
                      }}
                    >
                      <Input
                        type="text"
                        placeholder="비밀번호"
                        value={delPassword}
                        onChange={(e) =>
                          setDelPassword(e.target.value)
                        }
                      />
                    </Modal>
                  )}
                </div>
                <Card.Meta
                  avatar={
                    <Avatar
                      src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${item.id}`}
                    />
                  }
                  title={<span>{item.nickname}</span>}
                  description={
                    <>
                      {item.content}
                      <Rate
                        style={{ float: 'right' }}
                        disabled
                        allowHalf
                        defaultValue={item.rate}
                      />
                    </>
                  }
                />
                <div style={{ marginTop: '1rem' }}>
                  {item.tag.map((tag, index) => (
                    <Tag key={index} color="cyan">
                      {tag}
                    </Tag>
                  ))}
                  <span style={{ float: 'right' }}>
                    {item.writeDate}
                  </span>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </div>
      <FloatButton
        style={{
          float: 'right',
          position: 'fixed',
          zIndex: '13',
        }}
        type="primary"
        onClick={() =>
          navigate('/review-write', { state: { sum: sum } })
        }
        icon={<PlusCircleOutlined />}
      />
    </div>
  );
}

export default ReviewPage;
