import React from 'react';
import { useNavigate } from 'react-router-dom';

function ReviewPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Review Page</h1>
      <button onClick={() => navigate('/')}>
        지도 페이지
      </button>
      <button onClick={() => navigate('/review-write')}>
        리뷰 작성 페이지
      </button>
    </div>
  );
}

export default ReviewPage;
