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
import ReviewResult from '../components/review-result';

function ReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, type } = location.state || {
    id: 1,
    type: false,
  };

  const [scrollPosition, setScrollPosition] = useState(0);
  const [reviewList, setReviewList] = useState([]);
  const [modalOpenId, setModalOpenId] = useState(null); // 수정된 상태
  const [delPassword, setDelPassword] = useState('');
  const [rate, setRate] = useState(0.0);
  const [mostTag, setMostTag] = useState([]); // 가장 많이 사용된 태그
  const [headerName, setHeaderName] = useState(''); // 헤더로 보낼

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

  const showModal = (id) => {
    setModalOpenId(id);
  };

  const handleCancel = () => {
    setModalOpenId(null);
  };

  const deleteReview = async (id) => {
    try {
      const response = await axios.delete(
        `https://poopchelin.kro.kr/review/${id}?password=${delPassword}`
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
        `https://poopchelin.kro.kr/review/tg/total/${id}?type=${type}`
      );
      if (response.status === 200) {
        const data = response.data;

        // Set the overall rate
        const rate = data.rate;
        setRate(rate);

        // Set the most frequent tags
        const tags = data.tag;
        setMostTag(tags);

        const name = data.name;
        setHeaderName(name);
        // Set the review list considering `recentReview` is an array
        const reviewDataList = data.recentReview.map(
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
    setMostTag(mostTag);
    reviewData();
  }, []);

  return (
    <div
      className="list-box"
      id="box"
      onScroll={handleScroll}
    >
      <Header name={headerName} rate={rate} tag={mostTag} />
      <div className="list-box-margin">
        {reviewList && reviewList.length > 0 ? (
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
        ) : (
          <ReviewResult />
        )}
      </div>
      <FloatButton
        style={{
          float: 'right',
          position: 'fixed',
          zIndex: '13',
        }}
        type="primary"
        onClick={() =>
          navigate('/review-write', {
            state: {
              id: id,
              name: headerName,
              rate: rate,
              type: type,
              tag: mostTag,
            },
          })
        }
        icon={<PlusCircleOutlined />}
      />
    </div>
  );
}

export default ReviewPage;
