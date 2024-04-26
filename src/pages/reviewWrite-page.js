import React from 'react';
import { useNavigate } from 'react-router-dom';

function ReviewWritePage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Review Write Page</h1>
      <button onClick={() => navigate('/')}>
        지도 페이지
      </button>
      <button onClick={() => navigate('/review')}>
        리뷰 페이지
      </button>
    </div>
  );
}

export default ReviewWritePage;
